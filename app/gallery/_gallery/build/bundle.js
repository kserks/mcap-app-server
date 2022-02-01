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
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
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

    const base = 'http://atlant.mcacademy.ru/reindexer/api/v1/db/mcap_art';


    var api = {
      locations: `${base}/namespaces/locations/items`,
      events: location=>{
        return `${base}/query?q=select%20%2a%20from%20events%20where%20location%3D%22${location}%22`
      },
      items: event=>{
        return `${base}/query?q=select%20%2a%20from%20items%20where%20event%3D%22${event}%22`
      }
    };

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

    let places = writable([]);
    let placeId = writable(null);
    let events = writable([]);
    let eventId = writable(null);
    let items = writable([]);


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


    let config = {
      artDir: 'art',

    };

    /* src\gallery\gallery\components\Halls.svelte generated by Svelte v3.46.3 */
    const file$6 = "src\\gallery\\gallery\\components\\Halls.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (33:4) {#each list as obj, index }
    function create_each_block$2(ctx) {
    	let li;
    	let t0_value = /*obj*/ ctx[4].name + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function mousedown_handler() {
    		return /*mousedown_handler*/ ctx[2](/*obj*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			add_location(li, file$6, 33, 6, 567);
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
    			if (dirty & /*list*/ 1 && t0_value !== (t0_value = /*obj*/ ctx[4].name + "")) set_data_dev(t0, t0_value);
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
    		source: "(33:4) {#each list as obj, index }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let h3;
    	let t1;
    	let ul;
    	let each_value = /*list*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "Список залов";
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h3, file$6, 29, 2, 495);
    			add_location(ul, file$6, 31, 2, 522);
    			attr_dev(div, "class", "component svelte-ckqbza");
    			add_location(div, file$6, 27, 0, 466);
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
    			if (dirty & /*handler, list*/ 3) {
    				each_value = /*list*/ ctx[0];
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Halls', slots, []);
    	let action = false;

    	fetch(api.locations).then(r => r.json()).then(res => {
    		$$invalidate(0, list = res.items);
    	});

    	function handler(obj) {
    		places.set(obj.map.split(','));
    		placeId.set(obj.id);

    		fetch(api.events(obj.id)).then(r => r.json()).then(res => {
    			events.set(res.items);
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Halls> was created with unknown prop '${key}'`);
    	});

    	const mousedown_handler = obj => {
    		handler(obj);
    	};

    	$$self.$capture_state = () => ({
    		api,
    		places,
    		placeId,
    		events,
    		action,
    		handler,
    		list
    	});

    	$$self.$inject_state = $$props => {
    		if ('action' in $$props) action = $$props.action;
    		if ('list' in $$props) $$invalidate(0, list = $$props.list);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(0, list = []);
    	return [list, handler, mousedown_handler];
    }

    class Halls extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Halls",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\gallery\gallery\components\Map.svelte generated by Svelte v3.46.3 */
    const file$5 = "src\\gallery\\gallery\\components\\Map.svelte";

    // (12:2) {#if $placeId}
    function create_if_block$1(ctx) {
    	let div;
    	let div_style_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "image-container svelte-32eg5c");
    			attr_dev(div, "style", div_style_value = /*mapImg*/ ctx[1]());
    			add_location(div, file$5, 12, 4, 199);
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(12:2) {#if $placeId}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let if_block = /*$placeId*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "component");
    			add_location(div, file$5, 10, 0, 152);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$placeId*/ ctx[0]) {
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
    			if (if_block) if_block.d();
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
    	validate_store(placeId, 'placeId');
    	component_subscribe($$self, placeId, $$value => $$invalidate(0, $placeId = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Map', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Map> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ placeId, mapImg, $placeId });

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

    	return [$placeId, mapImg];
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
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (20:4) {#each $events as obj}
    function create_each_block$1(ctx) {
    	let li;
    	let t_value = /*obj*/ ctx[3].name + "";
    	let t;
    	let mounted;
    	let dispose;

    	function mousedown_handler() {
    		return /*mousedown_handler*/ ctx[2](/*obj*/ ctx[3]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			add_location(li, file$4, 20, 6, 383);
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
    			if (dirty & /*$events*/ 1 && t_value !== (t_value = /*obj*/ ctx[3].name + "")) set_data_dev(t, t_value);
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
    		source: "(20:4) {#each $events as obj}",
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
    			h3.textContent = "Выставки";
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h3, file$4, 16, 2, 320);
    			add_location(ul, file$4, 18, 2, 343);
    			attr_dev(div, "class", "component svelte-y75has");
    			add_location(div, file$4, 15, 0, 293);
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
    			if (dirty & /*handler, $events*/ 3) {
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
    	let $events;
    	validate_store(events, 'events');
    	component_subscribe($$self, events, $$value => $$invalidate(0, $events = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Events', slots, []);

    	function handler(obj) {
    		fetch(api.items(obj.id)).then(r => r.json()).then(res => {
    			items.set(res.items);
    			eventId.set(obj.id);
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Events> was created with unknown prop '${key}'`);
    	});

    	const mousedown_handler = obj => {
    		handler(obj);
    	};

    	$$self.$capture_state = () => ({
    		api,
    		events,
    		eventId,
    		items,
    		handler,
    		$events
    	});

    	return [$events, handler, mousedown_handler];
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

    const { console: console_1 } = globals;

    const file$3 = "src\\gallery\\gallery\\components\\Places.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (71:4) {#each $places as item}
    function create_each_block(ctx) {
    	let li;
    	let t_value = /*item*/ ctx[10] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function mousedown_handler() {
    		return /*mousedown_handler*/ ctx[3](/*item*/ ctx[10]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			add_location(li, file$3, 71, 6, 1332);
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
    			if (dirty & /*$places*/ 1 && t_value !== (t_value = /*item*/ ctx[10] + "")) set_data_dev(t, t_value);
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
    		source: "(71:4) {#each $places as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div1;
    	let h3;
    	let t1;
    	let ul;
    	let t2;
    	let div0;
    	let mounted;
    	let dispose;
    	let each_value = /*$places*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Места";
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div0 = element("div");
    			div0.textContent = "Применить";
    			add_location(h3, file$3, 67, 2, 1271);
    			attr_dev(ul, "class", "svelte-5afvbs");
    			add_location(ul, file$3, 69, 2, 1291);
    			attr_dev(div0, "class", "btn svelte-5afvbs");
    			add_location(div0, file$3, 74, 2, 1412);
    			attr_dev(div1, "class", "component svelte-5afvbs");
    			add_location(div1, file$3, 66, 0, 1244);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h3);
    			append_dev(div1, t1);
    			append_dev(div1, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(div1, t2);
    			append_dev(div1, div0);

    			if (!mounted) {
    				dispose = listen_dev(div0, "mousedown", /*setCurrent*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*handler, $places*/ 5) {
    				each_value = /*$places*/ ctx[0];
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
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
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
    	let list;
    	let $currentImage;
    	let $placeId;
    	let $eventId;
    	let $items;
    	let $places;
    	validate_store(currentImage, 'currentImage');
    	component_subscribe($$self, currentImage, $$value => $$invalidate(5, $currentImage = $$value));
    	validate_store(placeId, 'placeId');
    	component_subscribe($$self, placeId, $$value => $$invalidate(6, $placeId = $$value));
    	validate_store(eventId, 'eventId');
    	component_subscribe($$self, eventId, $$value => $$invalidate(7, $eventId = $$value));
    	validate_store(items, 'items');
    	component_subscribe($$self, items, $$value => $$invalidate(8, $items = $$value));
    	validate_store(places, 'places');
    	component_subscribe($$self, places, $$value => $$invalidate(0, $places = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Places', slots, []);

    	async function setCurrent() {
    		let url = `/gallery/art?placeId=${$placeId}&eventId=${$eventId}`;

    		if ($eventId) {
    			try {
    				let res = await fetch(url);
    				console.log(res.status);
    			} catch(e) {
    				console.error(e);
    			}
    		} else {
    			console.log('[ eventId ] не задан');
    		}
    	}

    	function getCurrentItem(name) {
    		let data = $items.filter(item => item.name === name);

    		if (data.length > 0) {
    			set_store_value(currentImage, $currentImage.data = data[0], $currentImage);
    			let url = `/${config.artDir}/${$placeId}/arh/${$eventId}/${name}.${$currentImage.data.ext}`;
    			console.log(url);
    			set_store_value(currentImage, $currentImage.url = url, $currentImage);
    		} else {
    			set_store_value(currentImage, $currentImage.data = null, $currentImage);
    		}
    	}

    	function handler(name) {
    		if ($eventId) {
    			getCurrentItem(name);
    		} else {
    			let url = `/${config.artDir}/${$placeId}/cls/${name}.jpg`;
    			set_store_value(currentImage, $currentImage.url = url, $currentImage);
    		}
    	} /*
      let arr = [] 
       for(var i=0; i<$places.length;i++){

          for(let j =0; $items.length;j++){
            if($places[i].name===$items[j].name){
              arr.push({ data: $places[i], index: i })
            }
          }
       }

     console.log(arr)*/

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Places> was created with unknown prop '${key}'`);
    	});

    	const mousedown_handler = item => {
    		handler(item);
    	};

    	$$self.$capture_state = () => ({
    		places,
    		placeId,
    		eventId,
    		items,
    		config,
    		currentImage,
    		setCurrent,
    		getCurrentItem,
    		handler,
    		list,
    		$currentImage,
    		$placeId,
    		$eventId,
    		$items,
    		$places
    	});

    	$$self.$inject_state = $$props => {
    		if ('list' in $$props) list = $$props.list;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	list = [];
    	return [$places, setCurrent, handler, mousedown_handler];
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
    const file$2 = "src\\gallery\\gallery\\components\\Image.svelte";

    // (37:2) {#if !playerName}
    function create_if_block(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Загрузить";
    			attr_dev(div0, "class", "btn svelte-1p60pc");
    			add_location(div0, file$2, 38, 6, 781);
    			attr_dev(div1, "class", "btn-wrapper svelte-1p60pc");
    			add_location(div1, file$2, 37, 4, 748);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(37:2) {#if !playerName}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let div0_style_value;
    	let t;
    	let if_block = !/*playerName*/ ctx[2] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "image svelte-1p60pc");

    			attr_dev(div0, "style", div0_style_value = /*$currentImage*/ ctx[0].url
    			? /*backgroundImage*/ ctx[1]
    			: '');

    			add_location(div0, file$2, 34, 6, 639);
    			attr_dev(div1, "class", "image-viewer svelte-1p60pc");
    			add_location(div1, file$2, 33, 2, 605);
    			attr_dev(div2, "class", "component svelte-1p60pc");
    			add_location(div2, file$2, 32, 0, 578);
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
    			if (dirty & /*$currentImage, backgroundImage*/ 3 && div0_style_value !== (div0_style_value = /*$currentImage*/ ctx[0].url
    			? /*backgroundImage*/ ctx[1]
    			: '')) {
    				attr_dev(div0, "style", div0_style_value);
    			}

    			if (!/*playerName*/ ctx[2]) {
    				if (if_block) ; else {
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
    	let playerName;
    	let backgroundImage;
    	let $currentImage;
    	validate_store(currentImage, 'currentImage');
    	component_subscribe($$self, currentImage, $$value => $$invalidate(0, $currentImage = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Image', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Image> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		currentImage,
    		backgroundImage,
    		playerName,
    		$currentImage
    	});

    	$$self.$inject_state = $$props => {
    		if ('backgroundImage' in $$props) $$invalidate(1, backgroundImage = $$props.backgroundImage);
    		if ('playerName' in $$props) $$invalidate(2, playerName = $$props.playerName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$currentImage*/ 1) {
    			/*
    let getPlayer = ()=>{
        try {
          window.mcefQuery({
              request: "info",
              persistent: true,
              onSuccess: response=>{
                  playerName=  JSON.parse(response).name;
              }
          })
        }
        catch (errorCode) {
         
          playerName = true
          
        }
    }
    */
    			//getPlayer()
    			//let currentImage = '/gallery/_gallery/images/001/cur/zhemchuzhina.jpg'
    			$$invalidate(1, backgroundImage = `background-image: url(${$currentImage.url});`);
    		}
    	};

    	$$invalidate(2, playerName = null);
    	return [$currentImage, backgroundImage, playerName];
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

    /* src\gallery\gallery\components\Info.svelte generated by Svelte v3.46.3 */
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
    			div6.textContent = "Записать";
    			attr_dev(label0, "for", "");
    			attr_dev(label0, "class", "svelte-jrx5od");
    			add_location(label0, file$1, 11, 6, 161);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "info1");
    			add_location(input0, file$1, 12, 6, 197);
    			attr_dev(div0, "class", "info-item svelte-jrx5od");
    			add_location(div0, file$1, 10, 4, 130);
    			attr_dev(label1, "for", "");
    			attr_dev(label1, "class", "svelte-jrx5od");
    			add_location(label1, file$1, 15, 6, 317);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "info2");
    			add_location(input1, file$1, 16, 6, 353);
    			attr_dev(div1, "class", "info-item svelte-jrx5od");
    			add_location(div1, file$1, 14, 4, 286);
    			attr_dev(label2, "for", "");
    			attr_dev(label2, "class", "svelte-jrx5od");
    			add_location(label2, file$1, 19, 6, 473);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "class", "info3");
    			add_location(input2, file$1, 20, 6, 509);
    			attr_dev(div2, "class", "info-item svelte-jrx5od");
    			add_location(div2, file$1, 18, 4, 442);
    			attr_dev(label3, "for", "");
    			attr_dev(label3, "class", "svelte-jrx5od");
    			add_location(label3, file$1, 23, 6, 629);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "class", "info4");
    			add_location(input3, file$1, 24, 6, 665);
    			attr_dev(div3, "class", "info-item svelte-jrx5od");
    			add_location(div3, file$1, 22, 4, 598);
    			attr_dev(label4, "for", "");
    			attr_dev(label4, "class", "descr-label svelte-jrx5od");
    			add_location(label4, file$1, 27, 6, 785);
    			attr_dev(textarea, "class", "svelte-jrx5od");
    			add_location(textarea, file$1, 28, 6, 841);
    			attr_dev(div4, "class", "info-item svelte-jrx5od");
    			add_location(div4, file$1, 26, 4, 754);
    			attr_dev(div5, "class", "info");
    			add_location(div5, file$1, 8, 2, 101);
    			attr_dev(label5, "for", "#save");
    			attr_dev(label5, "class", "svelte-jrx5od");
    			add_location(label5, file$1, 34, 6, 995);
    			attr_dev(div6, "class", "btn");
    			attr_dev(div6, "id", "save");
    			add_location(div6, file$1, 35, 6, 1030);
    			attr_dev(div7, "class", "info-item svelte-jrx5od");
    			add_location(div7, file$1, 33, 4, 964);
    			attr_dev(div8, "class", "btn-wrapper svelte-jrx5od");
    			add_location(div8, file$1, 32, 2, 933);
    			attr_dev(div9, "class", "component svelte-jrx5od");
    			add_location(div9, file$1, 6, 0, 72);
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
    			set_input_value(input0, /*$currentImage*/ ctx[0].data.info1);
    			append_dev(div5, t2);
    			append_dev(div5, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t4);
    			append_dev(div1, input1);
    			set_input_value(input1, /*$currentImage*/ ctx[0].data.info2);
    			append_dev(div5, t5);
    			append_dev(div5, div2);
    			append_dev(div2, label2);
    			append_dev(div2, t7);
    			append_dev(div2, input2);
    			set_input_value(input2, /*$currentImage*/ ctx[0].data.info3);
    			append_dev(div5, t8);
    			append_dev(div5, div3);
    			append_dev(div3, label3);
    			append_dev(div3, t10);
    			append_dev(div3, input3);
    			set_input_value(input3, /*$currentImage*/ ctx[0].data.info4);
    			append_dev(div5, t11);
    			append_dev(div5, div4);
    			append_dev(div4, label4);
    			append_dev(div4, t13);
    			append_dev(div4, textarea);
    			set_input_value(textarea, /*$currentImage*/ ctx[0].data.descr);
    			append_dev(div9, t14);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, label5);
    			append_dev(div7, t15);
    			append_dev(div7, div6);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[1]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[2]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[3]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[4]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[5])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$currentImage*/ 1 && input0.value !== /*$currentImage*/ ctx[0].data.info1) {
    				set_input_value(input0, /*$currentImage*/ ctx[0].data.info1);
    			}

    			if (dirty & /*$currentImage*/ 1 && input1.value !== /*$currentImage*/ ctx[0].data.info2) {
    				set_input_value(input1, /*$currentImage*/ ctx[0].data.info2);
    			}

    			if (dirty & /*$currentImage*/ 1 && input2.value !== /*$currentImage*/ ctx[0].data.info3) {
    				set_input_value(input2, /*$currentImage*/ ctx[0].data.info3);
    			}

    			if (dirty & /*$currentImage*/ 1 && input3.value !== /*$currentImage*/ ctx[0].data.info4) {
    				set_input_value(input3, /*$currentImage*/ ctx[0].data.info4);
    			}

    			if (dirty & /*$currentImage*/ 1) {
    				set_input_value(textarea, /*$currentImage*/ ctx[0].data.descr);
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
    	let $currentImage;
    	validate_store(currentImage, 'currentImage');
    	component_subscribe($$self, currentImage, $$value => $$invalidate(0, $currentImage = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Info', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Info> was created with unknown prop '${key}'`);
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

    	$$self.$capture_state = () => ({ currentImage, $currentImage });

    	return [
    		$currentImage,
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
    	let halls;
    	let t0;
    	let events;
    	let t1;
    	let map;
    	let t2;
    	let aside1;
    	let places;
    	let t3;
    	let aside2;
    	let image;
    	let t4;
    	let info;
    	let current;
    	halls = new Halls({ $$inline: true });
    	events = new Events({ $$inline: true });
    	map = new Map$1({ $$inline: true });
    	places = new Places({ $$inline: true });
    	image = new Image({ $$inline: true });
    	info = new Info({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			aside0 = element("aside");
    			create_component(halls.$$.fragment);
    			t0 = space();
    			create_component(events.$$.fragment);
    			t1 = space();
    			create_component(map.$$.fragment);
    			t2 = space();
    			aside1 = element("aside");
    			create_component(places.$$.fragment);
    			t3 = space();
    			aside2 = element("aside");
    			create_component(image.$$.fragment);
    			t4 = space();
    			create_component(info.$$.fragment);
    			attr_dev(aside0, "class", "left svelte-1kcutqv");
    			add_location(aside0, file, 13, 2, 306);
    			attr_dev(aside1, "class", "center svelte-1kcutqv");
    			add_location(aside1, file, 18, 2, 378);
    			attr_dev(aside2, "class", "right svelte-1kcutqv");
    			add_location(aside2, file, 24, 2, 443);
    			attr_dev(main, "class", "svelte-1kcutqv");
    			add_location(main, file, 11, 0, 296);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, aside0);
    			mount_component(halls, aside0, null);
    			append_dev(aside0, t0);
    			mount_component(events, aside0, null);
    			append_dev(aside0, t1);
    			mount_component(map, aside0, null);
    			append_dev(main, t2);
    			append_dev(main, aside1);
    			mount_component(places, aside1, null);
    			append_dev(main, t3);
    			append_dev(main, aside2);
    			mount_component(image, aside2, null);
    			append_dev(aside2, t4);
    			mount_component(info, aside2, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(halls.$$.fragment, local);
    			transition_in(events.$$.fragment, local);
    			transition_in(map.$$.fragment, local);
    			transition_in(places.$$.fragment, local);
    			transition_in(image.$$.fragment, local);
    			transition_in(info.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(halls.$$.fragment, local);
    			transition_out(events.$$.fragment, local);
    			transition_out(map.$$.fragment, local);
    			transition_out(places.$$.fragment, local);
    			transition_out(image.$$.fragment, local);
    			transition_out(info.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(halls);
    			destroy_component(events);
    			destroy_component(map);
    			destroy_component(places);
    			destroy_component(image);
    			destroy_component(info);
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

    	$$self.$capture_state = () => ({ Halls, Map: Map$1, Events, Places, Image, Info });
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
    	target: document.body,
    	props: {

    	},


    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
