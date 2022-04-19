var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.3' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function objToUrl (obj){
      let query = [];
      for(let key in obj){
        let value = obj[key];
        if(typeof value==='string'){
          value = `"${value.replace(' ', '%20')}"`;
        }
        query.push(`%20${key}%20%3D%20${value}`);
      }
      return query.join(',')
    }

    const base = 'http://app.mcap.fun/reindexer/api/v1/db/mcap_art';

    var api = {
      locations: `${base}/namespaces/locations/items`,
      events: location=>{
        return `${base}/namespaces/events/items?q=select%20%2a%20from%20events%20where%20location%3D%22${location}%22`
      },
      items: event=>{
        return `${base}/namespaces/items/items?q=select%20%2a%20from%20items%20where%20event%3D%22${event}%22`
      },
      updateLocation: (id, obj)=>{
        return `http://app.mcap.fun/reindexer/api/put/db/mcap_art/namespaces/locations/items`
       // return `${base}/namespaces/locations/items?q=update%20locations%20set${objToUrl(obj)}%20where%20id%3D%22${id}%22`
      },
      updateInfo: (id, obj)=>{
        return `${base}/namespaces/items/items?q=update%20items%20set${objToUrl(obj)}%20where%20id%3D%22${id}%22`
      },
      addItem: `${base}/namespaces/items/items`,
    };

    // PUT /db/{database}/namespaces/{name}/items

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    let locations = writable([]);
    let places = writable([]);
    let placeId = writable(null);
    let placeObj = writable(null);
    let events = writable([]);
    let eventId = writable(null);
    let items = writable([]);
    let itemId = writable(null);
    let imageFileType = writable(null);
    let showMap = writable(false);
    let currentImage = writable({
                  url: null,
                  data: {
                    info1: null,
                    info2: null,
                    info3: null,
                    info4: null,
                    descr: null
                  }
           });
    let itemData = writable(null);

    let isImgExist = writable(true);

    let playerName = writable(null);

    let config = {
      artDir: 'art',
      PORT: 8080
    };

    /**
     * Копируем изображения из [ cls ] в папку [ cur ]
     */

    function currentReset (id){

        fetch(`/${config.PORT}/gallery/art/cls?placeId=${id}`)
            .then(r=>{
                console.log(r);
            })
            .catch(e=>console.error(e));
    }

    /* src\gallery\gallery\components\Locations.svelte generated by Svelte v3.46.3 */

    const { console: console_1$3 } = globals;
    const file$6 = "src\\gallery\\gallery\\components\\Locations.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	child_ctx[13] = i;
    	return child_ctx;
    }

    // (75:4) {#each $locations as obj, index }
    function create_each_block$2(ctx) {
    	let li;
    	let t0_value = /*obj*/ ctx[11].name + "";
    	let t0;
    	let t1;
    	let li_class_value;
    	let mounted;
    	let dispose;

    	function mousedown_handler() {
    		return /*mousedown_handler*/ ctx[2](/*obj*/ ctx[11], /*index*/ ctx[13]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(li, "class", li_class_value = /*obj*/ ctx[11].active ? 'active' : '');
    			add_location(li, file$6, 75, 6, 1496);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = listen_dev(li, "mousedown", mousedown_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$locations*/ 1 && t0_value !== (t0_value = /*obj*/ ctx[11].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*$locations*/ 1 && li_class_value !== (li_class_value = /*obj*/ ctx[11].active ? 'active' : '')) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(75:4) {#each $locations as obj, index }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let h3;
    	let t1;
    	let ul;
    	let each_value = /*$locations*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "Залы";
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h3, file$6, 71, 2, 1426);
    			add_location(ul, file$6, 73, 2, 1445);
    			attr_dev(div, "class", "component svelte-jxsqag");
    			add_location(div, file$6, 69, 0, 1397);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(div, t1);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$locations, handler*/ 3) {
    				each_value = /*$locations*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let list;
    	let $placeObj;
    	let $events;
    	let $placeId;
    	let $locations;
    	let $places;
    	let $currentImage;
    	let $itemId;
    	validate_store(placeObj, 'placeObj');
    	component_subscribe($$self, placeObj, $$value => $$invalidate(4, $placeObj = $$value));
    	validate_store(events, 'events');
    	component_subscribe($$self, events, $$value => $$invalidate(5, $events = $$value));
    	validate_store(placeId, 'placeId');
    	component_subscribe($$self, placeId, $$value => $$invalidate(6, $placeId = $$value));
    	validate_store(locations, 'locations');
    	component_subscribe($$self, locations, $$value => $$invalidate(0, $locations = $$value));
    	validate_store(places, 'places');
    	component_subscribe($$self, places, $$value => $$invalidate(7, $places = $$value));
    	validate_store(currentImage, 'currentImage');
    	component_subscribe($$self, currentImage, $$value => $$invalidate(8, $currentImage = $$value));
    	validate_store(itemId, 'itemId');
    	component_subscribe($$self, itemId, $$value => $$invalidate(9, $itemId = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Locations', slots, []);
    	let action = false;

    	fetch(api.locations).then(r => r.json()).then(res => {
    		set_store_value(
    			locations,
    			$locations = res.items.map(item => {
    				return item;
    			}),
    			$locations
    		);
    	});

    	function handler(obj, index) {
    		set_store_value(itemId, $itemId = null, $itemId);
    		set_store_value(currentImage, $currentImage.url = '', $currentImage);

    		set_store_value(
    			places,
    			$places = obj.map.split(',').map(item => {
    				return { active: false, text: item, exist: true };
    			}),
    			$places
    		);

    		set_store_value(placeId, $placeId = obj.id, $placeId);
    		$locations.forEach(item => set_store_value(locations, $locations.active = false, $locations));
    		set_store_value(locations, $locations[index].active = true, $locations);
    		set_store_value(placeObj, $placeObj = $locations[index], $placeObj);

    		/*
      Копируем изображения из [ cls ] в папку [ cur ]
    */
    		if ($placeObj.event === 'cls') {
    			currentReset($placeId);
    		}

    		/**
     * Получаем список событий
     */
    		fetch(api.events(obj.id)).then(r => r.json()).then(res => {
    			set_store_value(
    				events,
    				$events = res.items.map(item => {
    					$placeObj.event === item.id
    					? item.current = true
    					: item.current = false;

    					item.active = false;
    					return item;
    				}),
    				$events
    			);
    		}).catch(e => console.error(e));
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Locations> was created with unknown prop '${key}'`);
    	});

    	const mousedown_handler = (obj, index) => {
    		handler(obj, index);
    	};

    	$$self.$capture_state = () => ({
    		api,
    		places,
    		placeId,
    		events,
    		itemId,
    		placeObj,
    		currentImage,
    		locations,
    		currentReset,
    		action,
    		handler,
    		list,
    		$placeObj,
    		$events,
    		$placeId,
    		$locations,
    		$places,
    		$currentImage,
    		$itemId
    	});

    	$$self.$inject_state = $$props => {
    		if ('action' in $$props) action = $$props.action;
    		if ('list' in $$props) list = $$props.list;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	list = [];
    	return [$locations, handler, mousedown_handler];
    }

    class Locations extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Locations",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\gallery\gallery\components\Map.svelte generated by Svelte v3.46.3 */
    const file$5 = "src\\gallery\\gallery\\components\\Map.svelte";

    // (13:2) {#if $placeId}
    function create_if_block$2(ctx) {
    	let div;
    	let div_style_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "image-container svelte-yucb16");
    			attr_dev(div, "style", div_style_value = /*mapImg*/ ctx[1]());
    			add_location(div, file$5, 13, 4, 295);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*mapImg*/ 2 && div_style_value !== (div_style_value = /*mapImg*/ ctx[1]())) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(13:2) {#if $placeId}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let div1_class_value;
    	let mounted;
    	let dispose;
    	let if_block = /*$placeId*/ ctx[0] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "x";
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "close svelte-yucb16");
    			add_location(div0, file$5, 11, 2, 209);
    			attr_dev(div1, "class", div1_class_value = "place-map " + (/*$showMap*/ ctx[2] ? 'show' : '') + " svelte-yucb16");
    			add_location(div1, file$5, 10, 0, 161);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			if (if_block) if_block.m(div1, null);

    			if (!mounted) {
    				dispose = listen_dev(div0, "mousedown", /*mousedown_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$placeId*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*$showMap*/ 4 && div1_class_value !== (div1_class_value = "place-map " + (/*$showMap*/ ctx[2] ? 'show' : '') + " svelte-yucb16")) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let mapImg;
    	let $placeId;
    	let $showMap;
    	validate_store(placeId, 'placeId');
    	component_subscribe($$self, placeId, $$value => $$invalidate(0, $placeId = $$value));
    	validate_store(showMap, 'showMap');
    	component_subscribe($$self, showMap, $$value => $$invalidate(2, $showMap = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Map', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Map> was created with unknown prop '${key}'`);
    	});

    	const mousedown_handler = () => {
    		set_store_value(showMap, $showMap = false, $showMap);
    	};

    	$$self.$capture_state = () => ({
    		placeId,
    		showMap,
    		mapImg,
    		$placeId,
    		$showMap
    	});

    	$$self.$inject_state = $$props => {
    		if ('mapImg' in $$props) $$invalidate(1, mapImg = $$props.mapImg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$placeId*/ 1) {
    			$$invalidate(1, mapImg = () => {
    				return `background-image: url(/art/${$placeId}/map.jpg);`;
    			});
    		}
    	};

    	return [$placeId, mapImg, $showMap, mousedown_handler];
    }

    class Map$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Map",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\gallery\gallery\components\Events.svelte generated by Svelte v3.46.3 */

    const file$4 = "src\\gallery\\gallery\\components\\Events.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (53:4) {#each $events as obj, index}
    function create_each_block$1(ctx) {
    	let li;
    	let t_value = /*obj*/ ctx[9].name + "";
    	let t;
    	let li_class_value;
    	let mounted;
    	let dispose;

    	function mousedown_handler() {
    		return /*mousedown_handler*/ ctx[2](/*obj*/ ctx[9], /*index*/ ctx[11]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", li_class_value = "" + ((/*obj*/ ctx[9].active ? 'active' : '') + " " + (/*obj*/ ctx[9].current ? 'currentEvent' : '') + " svelte-1t4m6wd"));
    			add_location(li, file$4, 53, 6, 1255);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);

    			if (!mounted) {
    				dispose = listen_dev(li, "mousedown", mousedown_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$events*/ 1 && t_value !== (t_value = /*obj*/ ctx[9].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*$events*/ 1 && li_class_value !== (li_class_value = "" + ((/*obj*/ ctx[9].active ? 'active' : '') + " " + (/*obj*/ ctx[9].current ? 'currentEvent' : '') + " svelte-1t4m6wd"))) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(53:4) {#each $events as obj, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let h3;
    	let t1;
    	let ul;
    	let each_value = /*$events*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "События";
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h3, file$4, 49, 2, 1186);
    			attr_dev(ul, "class", "svelte-1t4m6wd");
    			add_location(ul, file$4, 51, 2, 1208);
    			attr_dev(div, "class", "component svelte-1t4m6wd");
    			add_location(div, file$4, 48, 0, 1159);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(div, t1);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$events, eventsHandler*/ 3) {
    				each_value = /*$events*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $places;
    	let $items;
    	let $eventId;
    	let $events;
    	let $currentImage;
    	let $itemId;
    	validate_store(places, 'places');
    	component_subscribe($$self, places, $$value => $$invalidate(3, $places = $$value));
    	validate_store(items, 'items');
    	component_subscribe($$self, items, $$value => $$invalidate(4, $items = $$value));
    	validate_store(eventId, 'eventId');
    	component_subscribe($$self, eventId, $$value => $$invalidate(5, $eventId = $$value));
    	validate_store(events, 'events');
    	component_subscribe($$self, events, $$value => $$invalidate(0, $events = $$value));
    	validate_store(currentImage, 'currentImage');
    	component_subscribe($$self, currentImage, $$value => $$invalidate(6, $currentImage = $$value));
    	validate_store(itemId, 'itemId');
    	component_subscribe($$self, itemId, $$value => $$invalidate(7, $itemId = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Events', slots, []);

    	function eventsHandler(obj, index) {
    		set_store_value(itemId, $itemId = null, $itemId);
    		set_store_value(currentImage, $currentImage.url = '', $currentImage);

    		//убираю класс active со всех кнопок
    		$events.forEach(item => item.active = false);

    		//добавляю класс active на кнопку по которой кликнули
    		set_store_value(events, $events[index].active = true, $events);

    		/**
     * Получаю список изображений из базы
     */
    		fetch(api.items(obj.id)).then(r => r.json()).then(res => {
    			set_store_value(items, $items = res.items, $items);
    			set_store_value(eventId, $eventId = obj.id, $eventId);

    			//переопределяю $places
    			isExistItem($items);
    		});
    	}

    	/**
     * Определяю существует ли изображения в базе
     * для всеконкретных мест
     */
    	function isExistItem(__items) {
    		let _places = $places.map(item => item.text);
    		let _items = __items.map(item => item.name);

    		set_store_value(
    			places,
    			$places = _places.map(i => {
    				if (_items.includes(i)) {
    					return { text: i, active: false, exist: true };
    				}

    				return { text: i, active: false, exist: false };
    			}),
    			$places
    		);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Events> was created with unknown prop '${key}'`);
    	});

    	const mousedown_handler = (obj, index) => {
    		eventsHandler(obj, index);
    	};

    	$$self.$capture_state = () => ({
    		api,
    		events,
    		eventId,
    		places,
    		items,
    		itemId,
    		currentImage,
    		placeObj,
    		locations,
    		eventsHandler,
    		isExistItem,
    		$places,
    		$items,
    		$eventId,
    		$events,
    		$currentImage,
    		$itemId
    	});

    	return [$events, eventsHandler, mousedown_handler];
    }

    class Events extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Events",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\gallery\gallery\components\Places.svelte generated by Svelte v3.46.3 */

    const { console: console_1$2 } = globals;
    const file$3 = "src\\gallery\\gallery\\components\\Places.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	child_ctx[21] = i;
    	return child_ctx;
    }

    // (144:4) {#each $places as item, index}
    function create_each_block(ctx) {
    	let li;
    	let t_value = /*item*/ ctx[19].text + "";
    	let t;
    	let li_class_value;
    	let mounted;
    	let dispose;

    	function mousedown_handler() {
    		return /*mousedown_handler*/ ctx[8](/*item*/ ctx[19], /*index*/ ctx[21]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);

    			attr_dev(li, "class", li_class_value = "" + ((/*item*/ ctx[19].active ? 'active' : '') + " " + (!/*item*/ ctx[19].exist && /*$eventId*/ ctx[1]
    			? 'not-exist'
    			: '') + " svelte-7k6sw3"));

    			add_location(li, file$3, 144, 6, 3193);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);

    			if (!mounted) {
    				dispose = listen_dev(li, "mousedown", mousedown_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$places*/ 8 && t_value !== (t_value = /*item*/ ctx[19].text + "")) set_data_dev(t, t_value);

    			if (dirty & /*$places, $eventId*/ 10 && li_class_value !== (li_class_value = "" + ((/*item*/ ctx[19].active ? 'active' : '') + " " + (!/*item*/ ctx[19].exist && /*$eventId*/ ctx[1]
    			? 'not-exist'
    			: '') + " svelte-7k6sw3"))) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(144:4) {#each $places as item, index}",
    		ctx
    	});

    	return block;
    }

    // (148:2) {#if $placeId}
    function create_if_block$1(ctx) {
    	let div0;
    	let t1;
    	let div1;
    	let t2;
    	let div1_class_value;
    	let t3;
    	let div2;
    	let t4;
    	let div2_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "Карта";
    			t1 = space();
    			div1 = element("div");
    			t2 = text("Сбросить");
    			t3 = space();
    			div2 = element("div");
    			t4 = text("Применить");
    			attr_dev(div0, "class", "btn mb10 svelte-7k6sw3");
    			add_location(div0, file$3, 148, 6, 3387);
    			attr_dev(div1, "class", div1_class_value = "btn mb10 " + (!/*$eventId*/ ctx[1] ? 'disabled' : '') + " svelte-7k6sw3");
    			add_location(div1, file$3, 149, 6, 3464);
    			attr_dev(div2, "class", div2_class_value = "btn " + (/*updated*/ ctx[0] ? 'updated' : '') + " " + (!/*$eventId*/ ctx[1] ? 'disabled' : '') + " svelte-7k6sw3");
    			add_location(div2, file$3, 150, 6, 3564);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, t4);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "mousedown", /*mousedown_handler_1*/ ctx[9], false, false, false),
    					listen_dev(div1, "mousedown", /*resetHandler*/ ctx[6], false, false, false),
    					listen_dev(div2, "mousedown", /*setCurrent*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$eventId*/ 2 && div1_class_value !== (div1_class_value = "btn mb10 " + (!/*$eventId*/ ctx[1] ? 'disabled' : '') + " svelte-7k6sw3")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty & /*updated, $eventId*/ 3 && div2_class_value !== (div2_class_value = "btn " + (/*updated*/ ctx[0] ? 'updated' : '') + " " + (!/*$eventId*/ ctx[1] ? 'disabled' : '') + " svelte-7k6sw3")) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(148:2) {#if $placeId}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let h3;
    	let t1;
    	let ul;
    	let t2;
    	let each_value = /*$places*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block = /*$placeId*/ ctx[2] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "Места";
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			if (if_block) if_block.c();
    			add_location(h3, file$3, 140, 2, 3125);
    			attr_dev(ul, "class", "svelte-7k6sw3");
    			add_location(ul, file$3, 142, 2, 3145);
    			attr_dev(div, "class", "component svelte-7k6sw3");
    			add_location(div, file$3, 139, 0, 3098);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(div, t1);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(div, t2);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$places, $eventId, imageHandler*/ 42) {
    				each_value = /*$places*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*$placeId*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $eventId;
    	let $events;
    	let $placeObj;
    	let $placeId;
    	let $currentImage;
    	let $places;
    	let $isImgExist;
    	let $imageFileType;
    	let $itemData;
    	let $items;
    	let $itemId;
    	let $showMap;
    	validate_store(eventId, 'eventId');
    	component_subscribe($$self, eventId, $$value => $$invalidate(1, $eventId = $$value));
    	validate_store(events, 'events');
    	component_subscribe($$self, events, $$value => $$invalidate(10, $events = $$value));
    	validate_store(placeObj, 'placeObj');
    	component_subscribe($$self, placeObj, $$value => $$invalidate(11, $placeObj = $$value));
    	validate_store(placeId, 'placeId');
    	component_subscribe($$self, placeId, $$value => $$invalidate(2, $placeId = $$value));
    	validate_store(currentImage, 'currentImage');
    	component_subscribe($$self, currentImage, $$value => $$invalidate(12, $currentImage = $$value));
    	validate_store(places, 'places');
    	component_subscribe($$self, places, $$value => $$invalidate(3, $places = $$value));
    	validate_store(isImgExist, 'isImgExist');
    	component_subscribe($$self, isImgExist, $$value => $$invalidate(13, $isImgExist = $$value));
    	validate_store(imageFileType, 'imageFileType');
    	component_subscribe($$self, imageFileType, $$value => $$invalidate(14, $imageFileType = $$value));
    	validate_store(itemData, 'itemData');
    	component_subscribe($$self, itemData, $$value => $$invalidate(15, $itemData = $$value));
    	validate_store(items, 'items');
    	component_subscribe($$self, items, $$value => $$invalidate(16, $items = $$value));
    	validate_store(itemId, 'itemId');
    	component_subscribe($$self, itemId, $$value => $$invalidate(17, $itemId = $$value));
    	validate_store(showMap, 'showMap');
    	component_subscribe($$self, showMap, $$value => $$invalidate(4, $showMap = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Places', slots, []);

    	function imageHandler(item, index) {
    		$places.forEach(item => item.active = false);
    		set_store_value(places, $places[index].active = true, $places);
    		set_store_value(itemId, $itemId = $places[index].text, $itemId);

    		if ($eventId) {
    			getCurrentItem(item.text);
    		} else {
    			let url = `/${config.artDir}/${$placeId}/cls/${item.text}.jpg`;
    			set_store_value(currentImage, $currentImage.url = url, $currentImage);
    		}
    	}

    	/**
     * Выбираем место и получаем пусть к текущему изображению
     */
    	function getCurrentItem(name) {
    		set_store_value(itemData, $itemData = $items.filter(item => item.name === name)[0], $itemData);

    		//$itemData = null
    		if ($itemData) {
    			//$itemData = data[0]
    			//$itemData.ext = $imageFileType
    			set_store_value(currentImage, $currentImage.data = $itemData, $currentImage);

    			let url = `/${config.artDir}/${$placeId}/arh/${$eventId}/${name}.${$itemData.ext}?v=${new Date().getTime()}`;
    			set_store_value(currentImage, $currentImage.url = url, $currentImage);
    			set_store_value(imageFileType, $imageFileType = null, $imageFileType);
    			set_store_value(isImgExist, $isImgExist = true, $isImgExist);
    		} else {
    			set_store_value(
    				currentImage,
    				$currentImage = {
    					url: '',
    					data: {
    						info1: null,
    						info2: null,
    						info3: null,
    						info4: null,
    						descr: null
    					}
    				},
    				$currentImage
    			);

    			set_store_value(isImgExist, $isImgExist = false, $isImgExist);
    		}
    	}

    	/**
     * reset currentDIR and ui-state
     */
    	function resetHandler() {
    		set_store_value(
    			events,
    			$events = $events.map(item => {
    				item.active = false;
    				return item;
    			}),
    			$events
    		);

    		set_store_value(
    			places,
    			$places = $places.map(item => {
    				item.active = false;
    				item.exist = true;
    				return item;
    			}),
    			$places
    		);

    		set_store_value(currentImage, $currentImage.url = '', $currentImage);

    		//fetch(api.updateLocation($placeObj.id, {event: 'cls'}));
    		set_store_value(placeObj, $placeObj.event = 'cls', $placeObj);

    		let obj = { ...$placeObj };
    		delete obj.active;

    		fetch(api.updateLocation(), {
    			method: 'POST',
    			body: JSON.stringify(obj)
    		}).then(e => {
    			window.location.reload();
    		}).catch(e => console.error(e)); //currentReset($placeId);
    	} //$events.map(item=>{
    	//item.current = false;

    	//})
    	/**
     * Задаем новое событие
     */
    	let updated = false;

    	async function setCurrent() {
    		let url = `/${config.PORT}/gallery/art?placeId=${$placeId}&eventId=${$eventId}`;
    		let obj = { ...$placeObj, event: $eventId };
    		delete obj.active;

    		if ($eventId) {
    			try {
    				let res = await fetch(url); // копирование изображений

    				fetch(api.updateLocation(), {
    					method: 'POST',
    					body: JSON.stringify(obj)
    				}).then(e => {
    					
    				}).catch(e => console.error(e)); //console.log(e)

    				set_store_value(
    					events,
    					$events = $events.map(item => {
    						if ($eventId === item.id) {
    							item.current = true;
    						} else {
    							item.current = false;
    						}

    						return item;
    					}),
    					$events
    				);

    				$$invalidate(0, updated = true);

    				setTimeout(
    					() => {
    						$$invalidate(0, updated = false);
    					},
    					1000
    				);
    			} catch(e) {
    				console.error(e);
    			}
    		} else {
    			console.log('[ eventId ] не задан');
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Places> was created with unknown prop '${key}'`);
    	});

    	const mousedown_handler = (item, index) => {
    		imageHandler(item, index);
    	};

    	const mousedown_handler_1 = () => {
    		set_store_value(showMap, $showMap = true, $showMap);
    	};

    	$$self.$capture_state = () => ({
    		api,
    		places,
    		placeId,
    		events,
    		placeObj,
    		eventId,
    		items,
    		itemId,
    		itemData,
    		config,
    		currentImage,
    		showMap,
    		isImgExist,
    		imageFileType,
    		currentReset,
    		imageHandler,
    		getCurrentItem,
    		resetHandler,
    		updated,
    		setCurrent,
    		$eventId,
    		$events,
    		$placeObj,
    		$placeId,
    		$currentImage,
    		$places,
    		$isImgExist,
    		$imageFileType,
    		$itemData,
    		$items,
    		$itemId,
    		$showMap
    	});

    	$$self.$inject_state = $$props => {
    		if ('updated' in $$props) $$invalidate(0, updated = $$props.updated);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		updated,
    		$eventId,
    		$placeId,
    		$places,
    		$showMap,
    		imageHandler,
    		resetHandler,
    		setCurrent,
    		mousedown_handler,
    		mousedown_handler_1
    	];
    }

    class Places extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Places",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\gallery\gallery\components\Image.svelte generated by Svelte v3.46.3 */

    const { console: console_1$1 } = globals;

    const file$2 = "src\\gallery\\gallery\\components\\Image.svelte";

    // (82:2) {#if !$playerName}
    function create_if_block(ctx) {
    	let div2;
    	let div1;
    	let label;
    	let div0;
    	let t0;
    	let div0_class_value;
    	let t1;
    	let input;
    	let div2_class_value;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			label = element("label");
    			div0 = element("div");
    			t0 = text("Загрузить");
    			t1 = space();
    			input = element("input");
    			attr_dev(div0, "class", div0_class_value = "btn " + (/*updated*/ ctx[0] ? 'updated' : '') + " svelte-5yglgx");
    			add_location(div0, file$2, 86, 12, 2402);
    			attr_dev(label, "for", "file-input");
    			attr_dev(label, "class", "svelte-5yglgx");
    			add_location(label, file$2, 85, 10, 2364);
    			attr_dev(input, "id", "file-input");
    			attr_dev(input, "type", "file");
    			attr_dev(input, "accept", "image/*");
    			attr_dev(input, "class", "svelte-5yglgx");
    			add_location(input, file$2, 89, 10, 2491);
    			attr_dev(div1, "class", "image-upload svelte-5yglgx");
    			add_location(div1, file$2, 84, 8, 2325);
    			attr_dev(div2, "class", div2_class_value = "btn-wrapper " + (/*$itemId*/ ctx[3] ? '' : 'disabled') + " svelte-5yglgx");
    			add_location(div2, file$2, 82, 4, 2258);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, label);
    			append_dev(label, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);
    			append_dev(div1, input);
    			/*input_binding*/ ctx[5](input);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*updated*/ 1 && div0_class_value !== (div0_class_value = "btn " + (/*updated*/ ctx[0] ? 'updated' : '') + " svelte-5yglgx")) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*$itemId*/ 8 && div2_class_value !== (div2_class_value = "btn-wrapper " + (/*$itemId*/ ctx[3] ? '' : 'disabled') + " svelte-5yglgx")) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			/*input_binding*/ ctx[5](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(82:2) {#if !$playerName}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t;
    	let if_block = !/*$playerName*/ ctx[4] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "image svelte-5yglgx");
    			set_style(div0, "background-image", "url(" + (/*$currentImage*/ ctx[2].url || '') + ")");
    			add_location(div0, file$2, 79, 6, 2140);
    			attr_dev(div1, "class", "image-viewer svelte-5yglgx");
    			add_location(div1, file$2, 78, 2, 2106);
    			attr_dev(div2, "class", "component svelte-5yglgx");
    			add_location(div2, file$2, 77, 0, 2079);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div2, t);
    			if (if_block) if_block.m(div2, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$currentImage*/ 4) {
    				set_style(div0, "background-image", "url(" + (/*$currentImage*/ ctx[2].url || '') + ")");
    			}

    			if (!/*$playerName*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div2, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $imageFileType;
    	let $currentImage;
    	let $itemId;
    	let $eventId;
    	let $placeId;
    	let $places;
    	let $itemData;
    	let $playerName;
    	validate_store(imageFileType, 'imageFileType');
    	component_subscribe($$self, imageFileType, $$value => $$invalidate(6, $imageFileType = $$value));
    	validate_store(currentImage, 'currentImage');
    	component_subscribe($$self, currentImage, $$value => $$invalidate(2, $currentImage = $$value));
    	validate_store(itemId, 'itemId');
    	component_subscribe($$self, itemId, $$value => $$invalidate(3, $itemId = $$value));
    	validate_store(eventId, 'eventId');
    	component_subscribe($$self, eventId, $$value => $$invalidate(7, $eventId = $$value));
    	validate_store(placeId, 'placeId');
    	component_subscribe($$self, placeId, $$value => $$invalidate(8, $placeId = $$value));
    	validate_store(places, 'places');
    	component_subscribe($$self, places, $$value => $$invalidate(9, $places = $$value));
    	validate_store(itemData, 'itemData');
    	component_subscribe($$self, itemData, $$value => $$invalidate(10, $itemData = $$value));
    	validate_store(playerName, 'playerName');
    	component_subscribe($$self, playerName, $$value => $$invalidate(4, $playerName = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Image', slots, []);

    	try {
    		window.mcefQuery({
    			request: "info",
    			persistent: true,
    			onSuccess: response => {
    				set_store_value(playerName, $playerName = JSON.parse(response).name, $playerName);
    			}
    		});
    	} catch(errorCode) {
    		set_store_value(playerName, $playerName = false, $playerName);
    	}

    	let updated = false;
    	let IMG = null;

    	onMount(() => {

    		IMG.addEventListener('change', event => {
    			let file = IMG.files[0];
    			let ext = file.type.split('/')[1];

    			if (ext === 'jpeg') {
    				ext = 'jpg';
    			}

    			let name = `${$placeId}_____${$eventId}_____${$itemId}.${ext}`;

    			// конструкторы для подготовки изображения для отправки на сервер
    			let newFile = new File([file], name, { type: file.type });

    			let body = new FormData();
    			body.append('file', newFile);

    			fetch('/gallery/art/saveImage', { method: 'POST', body }).then(data => {
    				// убираем красный клас
    				set_store_value(
    					places,
    					$places = $places.map(item => {
    						if (item.text === $itemId) {
    							item.exist = true;
    						}

    						return item;
    					}),
    					$places
    				);

    				//показываем загружнное изображение
    				//добавляю немного мусора что бы url отличался и свойство обновлялись
    				let url = `/${config.artDir}/${$placeId}/arh/${$eventId}/${$itemId}.${ext}?v=${new Date().getTime()}`;

    				set_store_value(currentImage, $currentImage.url = url, $currentImage);
    				set_store_value(imageFileType, $imageFileType = ext, $imageFileType);

    				//показываем зеленый клас
    				$$invalidate(0, updated = true);

    				setTimeout(
    					() => {
    						$$invalidate(0, updated = false);
    					},
    					1000
    				);
    			}).catch(error => console.error(error));
    		});
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Image> was created with unknown prop '${key}'`);
    	});

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			IMG = $$value;
    			$$invalidate(1, IMG);
    		});
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		currentImage,
    		config,
    		playerName,
    		placeId,
    		imageFileType,
    		itemId,
    		eventId,
    		itemData,
    		places,
    		updated,
    		IMG,
    		$imageFileType,
    		$currentImage,
    		$itemId,
    		$eventId,
    		$placeId,
    		$places,
    		$itemData,
    		$playerName
    	});

    	$$self.$inject_state = $$props => {
    		if ('updated' in $$props) $$invalidate(0, updated = $$props.updated);
    		if ('IMG' in $$props) $$invalidate(1, IMG = $$props.IMG);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [updated, IMG, $currentImage, $itemId, $playerName, input_binding];
    }

    class Image extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Image",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    var IDX=256, HEX=[];
    while (IDX--) HEX[IDX] = (IDX + 256).toString(16).substring(1);

    function uid (){
        var seed = Date.now();

        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (seed + Math.random() * 16) % 16 | 0;
            seed = Math.floor(seed/16);

            return (c === 'x' ? r : r & (0x3|0x8)).toString(16);
        });

        return uuid;
    }

    /* src\gallery\gallery\components\Info.svelte generated by Svelte v3.46.3 */

    const { console: console_1 } = globals;
    const file$1 = "src\\gallery\\gallery\\components\\Info.svelte";

    function create_fragment$1(ctx) {
    	let div9;
    	let div5;
    	let div0;
    	let label0;
    	let t1;
    	let input0;
    	let t2;
    	let div1;
    	let label1;
    	let t4;
    	let input1;
    	let t5;
    	let div2;
    	let label2;
    	let t7;
    	let input2;
    	let t8;
    	let div3;
    	let label3;
    	let t10;
    	let input3;
    	let t11;
    	let div4;
    	let label4;
    	let t13;
    	let textarea;
    	let t14;
    	let div8;
    	let div7;
    	let label5;
    	let t15;
    	let div6;
    	let t16;
    	let div6_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div5 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "info1";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "info2";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = "info3";
    			t7 = space();
    			input2 = element("input");
    			t8 = space();
    			div3 = element("div");
    			label3 = element("label");
    			label3.textContent = "info4";
    			t10 = space();
    			input3 = element("input");
    			t11 = space();
    			div4 = element("div");
    			label4 = element("label");
    			label4.textContent = "descr";
    			t13 = space();
    			textarea = element("textarea");
    			t14 = space();
    			div8 = element("div");
    			div7 = element("div");
    			label5 = element("label");
    			t15 = space();
    			div6 = element("div");
    			t16 = text("Сохранить изменения");
    			attr_dev(label0, "for", "");
    			attr_dev(label0, "class", "svelte-jrx5od");
    			add_location(label0, file$1, 75, 6, 1748);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "info1");
    			add_location(input0, file$1, 76, 6, 1784);
    			attr_dev(div0, "class", "info-item svelte-jrx5od");
    			add_location(div0, file$1, 74, 4, 1717);
    			attr_dev(label1, "for", "");
    			attr_dev(label1, "class", "svelte-jrx5od");
    			add_location(label1, file$1, 79, 6, 1904);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "info2");
    			add_location(input1, file$1, 80, 6, 1940);
    			attr_dev(div1, "class", "info-item svelte-jrx5od");
    			add_location(div1, file$1, 78, 4, 1873);
    			attr_dev(label2, "for", "");
    			attr_dev(label2, "class", "svelte-jrx5od");
    			add_location(label2, file$1, 83, 6, 2060);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "class", "info3");
    			add_location(input2, file$1, 84, 6, 2096);
    			attr_dev(div2, "class", "info-item svelte-jrx5od");
    			add_location(div2, file$1, 82, 4, 2029);
    			attr_dev(label3, "for", "");
    			attr_dev(label3, "class", "svelte-jrx5od");
    			add_location(label3, file$1, 87, 6, 2216);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "class", "info4");
    			add_location(input3, file$1, 88, 6, 2252);
    			attr_dev(div3, "class", "info-item svelte-jrx5od");
    			add_location(div3, file$1, 86, 4, 2185);
    			attr_dev(label4, "for", "");
    			attr_dev(label4, "class", "descr-label svelte-jrx5od");
    			add_location(label4, file$1, 91, 6, 2372);
    			attr_dev(textarea, "class", "svelte-jrx5od");
    			add_location(textarea, file$1, 92, 6, 2428);
    			attr_dev(div4, "class", "info-item svelte-jrx5od");
    			add_location(div4, file$1, 90, 4, 2341);
    			attr_dev(div5, "class", "info");
    			add_location(div5, file$1, 72, 2, 1688);
    			attr_dev(label5, "for", "#save");
    			attr_dev(label5, "class", "svelte-jrx5od");
    			add_location(label5, file$1, 98, 6, 2582);
    			attr_dev(div6, "class", div6_class_value = "btn " + (/*$currentImage*/ ctx[1].url ? '' : 'disabled') + " " + (/*updated*/ ctx[0] ? 'updated' : ''));
    			attr_dev(div6, "id", "save");
    			add_location(div6, file$1, 99, 6, 2617);
    			attr_dev(div7, "class", "info-item svelte-jrx5od");
    			add_location(div7, file$1, 97, 4, 2551);
    			attr_dev(div8, "class", "btn-wrapper svelte-jrx5od");
    			add_location(div8, file$1, 96, 2, 2520);
    			attr_dev(div9, "class", "component svelte-jrx5od");
    			add_location(div9, file$1, 70, 0, 1659);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div5);
    			append_dev(div5, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			set_input_value(input0, /*$currentImage*/ ctx[1].data.info1);
    			append_dev(div5, t2);
    			append_dev(div5, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t4);
    			append_dev(div1, input1);
    			set_input_value(input1, /*$currentImage*/ ctx[1].data.info2);
    			append_dev(div5, t5);
    			append_dev(div5, div2);
    			append_dev(div2, label2);
    			append_dev(div2, t7);
    			append_dev(div2, input2);
    			set_input_value(input2, /*$currentImage*/ ctx[1].data.info3);
    			append_dev(div5, t8);
    			append_dev(div5, div3);
    			append_dev(div3, label3);
    			append_dev(div3, t10);
    			append_dev(div3, input3);
    			set_input_value(input3, /*$currentImage*/ ctx[1].data.info4);
    			append_dev(div5, t11);
    			append_dev(div5, div4);
    			append_dev(div4, label4);
    			append_dev(div4, t13);
    			append_dev(div4, textarea);
    			set_input_value(textarea, /*$currentImage*/ ctx[1].data.descr);
    			append_dev(div9, t14);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, label5);
    			append_dev(div7, t15);
    			append_dev(div7, div6);
    			append_dev(div6, t16);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[3]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[4]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[5]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[6]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[7]),
    					listen_dev(div6, "mousedown", /*save*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$currentImage*/ 2 && input0.value !== /*$currentImage*/ ctx[1].data.info1) {
    				set_input_value(input0, /*$currentImage*/ ctx[1].data.info1);
    			}

    			if (dirty & /*$currentImage*/ 2 && input1.value !== /*$currentImage*/ ctx[1].data.info2) {
    				set_input_value(input1, /*$currentImage*/ ctx[1].data.info2);
    			}

    			if (dirty & /*$currentImage*/ 2 && input2.value !== /*$currentImage*/ ctx[1].data.info3) {
    				set_input_value(input2, /*$currentImage*/ ctx[1].data.info3);
    			}

    			if (dirty & /*$currentImage*/ 2 && input3.value !== /*$currentImage*/ ctx[1].data.info4) {
    				set_input_value(input3, /*$currentImage*/ ctx[1].data.info4);
    			}

    			if (dirty & /*$currentImage*/ 2) {
    				set_input_value(textarea, /*$currentImage*/ ctx[1].data.descr);
    			}

    			if (dirty & /*$currentImage, updated*/ 3 && div6_class_value !== (div6_class_value = "btn " + (/*$currentImage*/ ctx[1].url ? '' : 'disabled') + " " + (/*updated*/ ctx[0] ? 'updated' : ''))) {
    				attr_dev(div6, "class", div6_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $items;
    	let $eventId;
    	let $currentImage;
    	let $itemId;
    	let $imageFileType;
    	let $isImgExist;
    	validate_store(items, 'items');
    	component_subscribe($$self, items, $$value => $$invalidate(8, $items = $$value));
    	validate_store(eventId, 'eventId');
    	component_subscribe($$self, eventId, $$value => $$invalidate(9, $eventId = $$value));
    	validate_store(currentImage, 'currentImage');
    	component_subscribe($$self, currentImage, $$value => $$invalidate(1, $currentImage = $$value));
    	validate_store(itemId, 'itemId');
    	component_subscribe($$self, itemId, $$value => $$invalidate(10, $itemId = $$value));
    	validate_store(imageFileType, 'imageFileType');
    	component_subscribe($$self, imageFileType, $$value => $$invalidate(11, $imageFileType = $$value));
    	validate_store(isImgExist, 'isImgExist');
    	component_subscribe($$self, isImgExist, $$value => $$invalidate(12, $isImgExist = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Info', slots, []);
    	let updated = false;

    	async function save() {
    		try {
    			let id = $currentImage.data.id;

    			let body = {
    				info1: $currentImage.data.info1,
    				info2: $currentImage.data.info2,
    				info3: $currentImage.data.info3,
    				info4: $currentImage.data.info4,
    				descr: $currentImage.data.descr,
    				ext: $imageFileType,
    				name: $itemId
    			};

    			if ($isImgExist) {
    				let res2 = await fetch(api.updateInfo(id, body));

    				//$itemData = Object.assign($itemData, body)
    				//показываем зеленый клас
    				$$invalidate(0, updated = true);

    				setTimeout(
    					() => {
    						$$invalidate(0, updated = false);
    					},
    					1000
    				);
    			} else {
    				let data = {
    					id: uid(),
    					ext: $imageFileType,
    					name: $itemId,
    					info1: $currentImage.data.info1 || '',
    					info2: $currentImage.data.info2 || '',
    					info3: $currentImage.data.info3 || '',
    					info4: $currentImage.data.info4 || '',
    					descr: $currentImage.data.descr || '',
    					event: $eventId
    				};

    				fetch(api.addItem, {
    					method: 'POST',
    					mode: 'cors',
    					headers: {
    						'Content-Type': 'application/x-www-form-urlencoded'
    					},
    					body: JSON.stringify(data)
    				}).then(r => {
    					//показываем зеленый клас
    					$$invalidate(0, updated = true);

    					setTimeout(
    						() => {
    							$$invalidate(0, updated = false);
    						},
    						1000
    					);

    					set_store_value(items, $items = [...$items, data], $items);
    				}).catch(e => console.error(e)); //$itemData = data
    			}
    		} catch(e) {
    			console.error(e);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Info> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		$currentImage.data.info1 = this.value;
    		currentImage.set($currentImage);
    	}

    	function input1_input_handler() {
    		$currentImage.data.info2 = this.value;
    		currentImage.set($currentImage);
    	}

    	function input2_input_handler() {
    		$currentImage.data.info3 = this.value;
    		currentImage.set($currentImage);
    	}

    	function input3_input_handler() {
    		$currentImage.data.info4 = this.value;
    		currentImage.set($currentImage);
    	}

    	function textarea_input_handler() {
    		$currentImage.data.descr = this.value;
    		currentImage.set($currentImage);
    	}

    	$$self.$capture_state = () => ({
    		api,
    		currentImage,
    		isImgExist,
    		eventId,
    		items,
    		itemId,
    		imageFileType,
    		itemData,
    		uid,
    		updated,
    		save,
    		$items,
    		$eventId,
    		$currentImage,
    		$itemId,
    		$imageFileType,
    		$isImgExist
    	});

    	$$self.$inject_state = $$props => {
    		if ('updated' in $$props) $$invalidate(0, updated = $$props.updated);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		updated,
    		$currentImage,
    		save,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		textarea_input_handler
    	];
    }

    class Info extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Info",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\gallery\gallery\App.svelte generated by Svelte v3.46.3 */
    const file = "src\\gallery\\gallery\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let aside0;
    	let locations;
    	let t0;
    	let events;
    	let t1;
    	let aside1;
    	let places;
    	let t2;
    	let aside2;
    	let image;
    	let t3;
    	let info;
    	let t4;
    	let map;
    	let current;
    	locations = new Locations({ $$inline: true });
    	events = new Events({ $$inline: true });
    	places = new Places({ $$inline: true });
    	image = new Image({ $$inline: true });
    	info = new Info({ $$inline: true });
    	map = new Map$1({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			aside0 = element("aside");
    			create_component(locations.$$.fragment);
    			t0 = space();
    			create_component(events.$$.fragment);
    			t1 = space();
    			aside1 = element("aside");
    			create_component(places.$$.fragment);
    			t2 = space();
    			aside2 = element("aside");
    			create_component(image.$$.fragment);
    			t3 = space();
    			create_component(info.$$.fragment);
    			t4 = space();
    			create_component(map.$$.fragment);
    			attr_dev(aside0, "class", "left svelte-un1qyu");
    			add_location(aside0, file, 13, 2, 314);
    			attr_dev(aside1, "class", "center svelte-un1qyu");
    			add_location(aside1, file, 17, 2, 379);
    			attr_dev(aside2, "class", "right svelte-un1qyu");
    			add_location(aside2, file, 20, 2, 431);
    			attr_dev(main, "class", "svelte-un1qyu");
    			add_location(main, file, 11, 0, 304);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, aside0);
    			mount_component(locations, aside0, null);
    			append_dev(aside0, t0);
    			mount_component(events, aside0, null);
    			append_dev(main, t1);
    			append_dev(main, aside1);
    			mount_component(places, aside1, null);
    			append_dev(main, t2);
    			append_dev(main, aside2);
    			mount_component(image, aside2, null);
    			append_dev(aside2, t3);
    			mount_component(info, aside2, null);
    			append_dev(main, t4);
    			mount_component(map, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(locations.$$.fragment, local);
    			transition_in(events.$$.fragment, local);
    			transition_in(places.$$.fragment, local);
    			transition_in(image.$$.fragment, local);
    			transition_in(info.$$.fragment, local);
    			transition_in(map.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(locations.$$.fragment, local);
    			transition_out(events.$$.fragment, local);
    			transition_out(places.$$.fragment, local);
    			transition_out(image.$$.fragment, local);
    			transition_out(info.$$.fragment, local);
    			transition_out(map.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(locations);
    			destroy_component(events);
    			destroy_component(places);
    			destroy_component(image);
    			destroy_component(info);
    			destroy_component(map);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Locations,
    		Map: Map$1,
    		Events,
    		Places,
    		Image,
    		Info
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
