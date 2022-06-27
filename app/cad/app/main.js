
/**
 * init
 */
  var designVersion = "Pre-Alpha-Dev";
    var mouse = new Mouse();
    var canvas = new Canvas(cnvs);
    var commandLine = new CommandLine(cmd_Line);
    var LM = new LayerManager();
    var SM = new StyleManager();

    //LM.addStandardLayers(); //TO DO: Where should start up scripts go?

    cnvs.addEventListener('mousedown', canvas.mousedown.bind(canvas), false);
    cnvs.addEventListener('mouseup', canvas.mouseup, false);
    cnvs.addEventListener('dblclick', canvas.dblclick, false);
    //cnvs.addEventListener('contextmenu', function() {canvas_contextmenu()}, false);
    //cnvs.addEventListener('wheel', canvas.wheel, false);
    cnvs.addEventListener('DOMMouseScroll', canvas.wheel, false);
    cnvs.addEventListener('mousewheel', canvas.wheel, false);
    cnvs.addEventListener('mousemove', mouse.mouseMoved.bind(mouse), false);
    cmd_Line.addEventListener('mouseup', commandLine.mouseup.bind(commandLine), false);
    window.addEventListener('contextmenu', function(e) {e.preventDefault()}, false);
    //window.addEventListener('keydown', commandLine.handleKeys.bind(commandLine), false);
    window.addEventListener('resize', canvas.resizeCanvas.bind(canvas), false);
    window.addEventListener('resize', function() {hideModals()}, false);
  
  document.getElementById('fileupload').addEventListener("change", function () {
    console.log(document.getElementById('fileupload').files[0])
    readFile(document.getElementById('fileupload').files[0])
  });
  
  function hideModals(){
      closePopover();
      closeColourPicker();
      closeSettings();
  }


   /* function canvas_contextmenu() {

        var listItems = [{
            name: "Enter", action: function(){reset(); closePopover();}
        }, 
        {
            name: "Mid Between 2 Points", action: function(){closePopover();}
        }, 
        {
            name: "Параметры", action: function(){showSettings(); closePopover();}
        }];
        popover_showList(listItems);
    }*/

    var lastDownTarget, canvas;
    window.onload = function() {
        document.addEventListener('mousedown', function(event) {
            lastDownTarget = event.target;
            //alert('mousedown');
        }, false);

        document.addEventListener('keydown', function(event) {
            if (lastDownTarget == cnvs || lastDownTarget == cmd_Line) {
                commandLine.handleKeys(event);

                var charCode = (event.charCode) ? event.charCode : event.keyCode;
                //if escape is pressed hide any popovers
                if (charCode === 27) {
                    hideModals()
                }
            }
        }, false);
    
    loadAllSettings();
    canvas.resizeCanvas();
    getCookieConsent();   
    
    }
    
/**
 * ColourPicker_setContent
 */


    function ColourPicker_setContent(content) {
        var ColourPicker = document.getElementById("ColourPicker-body")
        ColourPicker.innerHTML = content;
        //showColourPicker();
    }
  
  
      function ColourPicker_appendContent(content) {
        ColourPicker_clearContent();
        var ColourPicker = document.getElementById("ColourPicker-body");
        ColourPicker.appendChild(content);
        //showColourPicker();
    }

    function ColourPicker_clearContent() {
        var ColourPicker = document.getElementById("ColourPicker-body")
        ColourPicker.innerHTML = '';
    }
  
    function showColourPicker(ev, callback, caller) {
        document.getElementById('ColourPickerWindow').style.display = "block";
        positionColourPicker(ev);
    
    
    var ColourPicker_table = document.createElement("div");
        ColourPicker_table.className = "ColourPicker-table";
        ColourPicker_table.id = "ColourPicker-table";

        var colours = [1, 2, 3, 4, 5, 6, 230, 30, 7, 8, 9, 255]

        for (var i = 0; i < colours.length; i++) {
        var ACIColour = document.createElement("div");
        ACIColour.className = "Design-shape"
        ACIColour.style.backgroundColor = getHexColour(colours[i]);
        ACIColour.id = getHexColour(colours[i]);
        ACIColour.onmousedown = function(e) {
        //LM.layers[layerIndex].colour = this.id;
        //console.log(" selected colour " + this.id);
    
        //return selected colour and redraw canvas
        closeColourPicker()
        canvas.requestPaint()
    var selectedColour = this.id;
    callback(selectedColour, caller);

        };

        ColourPicker_table.appendChild(ACIColour);
                    }
      
    ColourPicker_appendContent(ColourPicker_table)
    
    }
  
  

    function closeColourPicker() {
        document.getElementById('ColourPickerWindow').style.display = "none";
    }

    function positionColourPicker(ev) {
        var clickCoords = getPosition(ev);
        var clickCoordsX = clickCoords.x;
        var clickCoordsY = clickCoords.y;
        var ColourPicker = document.getElementById('ColourPicker-body');

        ColourPickerWidth = ColourPicker.offsetWidth + 4;
        ColourPickerHeight = ColourPicker.offsetHeight + 4;

        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;

        if ((windowWidth - clickCoordsX) < ColourPickerWidth) {
            ColourPicker.style.left = windowWidth - ColourPickerWidth + "px";
        } else {
            ColourPicker.style.left = clickCoordsX - (ColourPickerWidth / 2) + "px";
        }

        if ((windowHeight - clickCoordsY) < ColourPickerHeight) {
            ColourPicker.style.top = windowHeight - ColourPickerHeight - 10 + "px";
        } else {
            ColourPicker.style.top = clickCoordsY + 10 + "px";
        }
    }

    function getPosition(ev) {
        var posx = 0;
        var posy = 0;

        if (!e) var e = window.event;

        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        return {
            x: posx,
            y: posy
        }
    }

    // When the user clicks anywhere outside of the dialogs, close them
    window.onclick = function(event) {
        if (event.target == document.getElementById('ColourPickerWindow')) {
      console.log("Close Colour Picker")
            closeColourPicker()
        }
    }

    //import this document in to the Design.html Document
    //var import1 = document.currentScript.ownerDocument.querySelector("#ColourPickerWindow");
    //document.body.appendChild(document.currentScript.ownerDocument.importNode(import1, true));



/**
 * getPosition
 */


 /*   function clickInsideElement(e, className) {
        var el = e.srcElement || e.target;

        if (el.classList.contains(className)) {
            return el;
        } else {
            while (el = el.parentNode) {
                if (el.classList && el.classList.contains(className)) {
                    return el;
                }
            }
        }

        return false;
    }
    */

    /**
     * Get's exact position of event.
     * 
     * @param {Object} e The event passed in
     * @return {Object} Returns the x and y position
     */
    function getPosition(e) {
        
        console.log("get position of menu")
        var posx = 0;
        var posy = 0;

        if (!e) var e = window.event;

        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        return {
            x: posx,
            y: posy
        }
    }

    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //
    // C O R E    F U N C T I O N S
    //
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    /**
     * Variables.
     */
    var contextMenuClassName = "context-menu";
    var contextMenuItemClassName = "context-menu__item";
    var contextMenuLinkClassName = "context-menu__link";
    var contextMenuActive = "context-menu--active";

    var taskItemClassName = "LayerManagerListItem";
    //var taskItemInContext = true;

    var clickCoords;
    var clickCoordsX;
    var clickCoordsY;

    var menu = document.getElementById('context-menu'); //document.currentScript.ownerDocument.querySelector("#context-menu");
    //var menu = document.getElementById("context-menu").style.display = "block";
    var menuItems = menu.querySelectorAll(".context-menu__item");
    var menuState = 0;
    var menuWidth;
    var menuHeight;
    var menuPosition;
    var menuPositionX;
    var menuPositionY;

    var windowWidth;
    var windowHeight;

    /**
     * Initialise our application's code.
     */
    function init() {
        contextListener();
        clickListener();
        keyupListener();
        resizeListener();
    }

    /**
     * Listens for contextmenu events.
     */
    /*
    function contextListener() {
        document.addEventListener("contextmenu", function(e) {
            taskItemInContext = clickInsideElement(e, taskItemClassName);

            if (taskItemInContext) {
                e.preventDefault();
                toggleMenuOn();
                positionMenu(e);
            } else {
                taskItemInContext = null;
                toggleMenuOff();
            }
        });
    }

    /**
     * Listens for click events.
     */
    /*
    function clickListener() {
        document.addEventListener("click", function(e) {
            var clickeElIsLink = clickInsideElement(e, contextMenuLinkClassName);

            if (clickeElIsLink) {
                e.preventDefault();
                menuItemListener(clickeElIsLink);
            } else {
                var button = e.which || e.button;
                if (button === 1) {
                    toggleMenuOff();
                }
            }
        });
    }

    /**
     * Listens for keyup events.
     */
    function keyupListener() {
        window.onkeyup = function(e) {
            if (e.keyCode === 27) {
                toggleMenuOff();
            }
        }
    }

    /**
     * Window resize event listener
     */
    function resizeListener() {
        window.onresize = function(e) {
            toggleMenuOff();
        };
    }

    /**
     * Turns the custom context menu on.
     */
    function toggleMenuOn() {
        menu.style.display = "none";
        console.log(menu.style.display);
        
        if (menuState !== 1) {
            console.log("menu on")
            menuState = 1;
            menu.style.display = "block";
            //menu.className += contextMenuActive;
            //menu.classList.add(contextMenuActive);
            console.log(menu.style.display);
        }
    }

    /**
     * Turns the custom context menu off.
     */
    function toggleMenuOff() {
        if (menuState !== 0) {
            menuState = 0;
            menu.classList.remove(contextMenuActive);
        }
    }

    /**
     * Positions the menu properly.
     * 
     * @param {Object} e The event
     */
    function positionMenu(e) {
        clickCoords = getPosition(e);
        clickCoordsX = clickCoords.x;
        clickCoordsY = clickCoords.y;
        
        console.log(clickCoordsX, clickCoordsY)

        menuWidth = menu.offsetWidth + 4;
        menuHeight = menu.offsetHeight + 4;
        
        console.log("width: ",menuWidth, " Height: ", menuHeight)

        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
        
        console.log("width: ",windowWidth, " Height: ", windowHeight)

        if ((windowWidth - clickCoordsX) < menuWidth) {
            menu.style.left = windowWidth - menuWidth + "px";
        } else {
            menu.style.left = clickCoordsX + "px";
        }

        if ((windowHeight - clickCoordsY) < menuHeight) {
            menu.style.top = windowHeight - menuHeight + "px";
        } else {
            menu.style.top = clickCoordsY + "px";
        }
    }

    /**
     * Dummy action function that logs an action when a menu item link is clicked
     * 
     * @param {HTMLElement} link The link that was clicked
     */
    function menuItemListener(link) {
        console.log("Task ID - " + taskItemInContext.getAttribute("data-id") + ", Task action - " + link.getAttribute("data-action"));
        toggleMenuOff();
    }

    /**
     * Run the app.
     */
    //init();

    //import this document in to the Design.html Document
    //var import2 = document.currentScript.ownerDocument.querySelector("#context-menu");

    //document.body.appendChild(document.currentScript.ownerDocument.importNode(import2, true));



/**
 * showHideLayerManager
 */

    function showHideLayerManager() {

        var LM = document.getElementById("LayerManager");

        if (LM.style.width > "0px") {
            closeLayerManager();
        } else {
            closePropertiesManager();
            LM.style.width = "300px";
            loadLayers();
        }
    }

    function addNewLayer() {

        LM.newLayer()
        loadLayers();

    }

    /* Set the width of the side navigation to 0 */
    function closeLayerManager() {
        document.getElementById("LayerManager").style.width = "0";
    }

    function showlayerDetails(elemID) {

        for (var layer = 0; layer < LM.layerCount(); layer++) {
            // if (layers[layer].name + "-layerDetails" === elemID + "Details") {
            {

                var layer = LM.getLayerByIndex(layer);

                var detailsDiv = document.getElementById(elemID + "Details")
                    //detailsDiv.innerHTML = '';

                var layerName = layer.name

                detailsDiv.innerHTML = ' \
    <div class="Design-sidebar-listitem"> \
    <div class="Design-sidebar-listitem-child"><p>Frozen</p></div> \
    <div class="Design-sidebar-listitem-child"> \
    <label class="tickbox"><input type="checkbox" id="' + layerName + 'frozenStatus" onclick="frozen(' + layerName + ', this.checked)"/><span class="tkbtn"></span></label> \
    </div> \
    </div> \
    <div class="Design-sidebar-listitem"> \
    <div class="Design-sidebar-listitem-child"><p>Locked</p></div> \
        <div class="Design-sidebar-listitem-child"> \
    <label class="tickbox"><input type="checkbox" id="' + layerName + 'lockedStatus" onclick=""/><span class="tkbtn"></span></label> \
    </div> \
    </div> \
    <div class="Design-sidebar-listitem"> \
    <div class="Design-sidebar-listitem-child"><p>Plot</p></div> \
        <div class="Design-sidebar-listitem-child"> \
    <label class="tickbox"><input type="checkbox" id="' + layerName + 'plottingStatus" onclick=""/><span class="tkbtn"></span></label> \
    </div> \
    </div> \
    <div class="Design-sidebar-listitem"> \
    <div class="Design-sidebar-listitem-child"><p>Linetype</p></div> \
    <div class="Design-sidebar-listitem-child"><p id="' + layerName + 'linetypeStatus"></p></div> \
    </div> \
    <div class="Design-sidebar-listitem"> \
    <div class="Design-sidebar-listitem-child"><p>Lineweight</p></div> \
    <div class="Design-sidebar-listitem-child"><p id="' + layerName + 'lineweightStatus"></p></div> \
    </div> \
    ';

                document.getElementById(layerName + "frozenStatus").checked = layer.frozen;
                document.getElementById(layerName + "lockedStatus").checked = layer.locked;
                document.getElementById(layerName + "plottingStatus").checked = layer.plotting;
                document.getElementById(layerName + "linetypeStatus").innerHTML = layer.lineType;
                document.getElementById(layerName + "lineweightStatus").innerHTML = layer.lineWeight;

            }
        }
    }

    function showHideLayerDetails(elemID) {

        var elemIDstate = document.getElementById(elemID + "Details").style.display;
        console.log(elemID, elemIDstate)

        //hide any expanded sections

        var divs = document.querySelectorAll("[id]");
        for (var i = 0, len = divs.length; i < len; i++) {
            var div = divs[i];
            if (div.id.indexOf("Details") > -1) {
                div.style.height = "0px";
                div.style.display = "none";
            }
        }

        if (elemIDstate !== "block") {
            document.getElementById(elemID + "Details").style.display = "block";
            document.getElementById(elemID + "Details").style.height = "260px";
            showlayerDetails(elemID)
                //console.log("Show Details")
        }
    }
  
function layerColourChange(colour, layerIndex){
    console.log("change ", layerIndex, " to: ", colour);
        LM.layers[layerIndex].colour = colour;
        loadLayers();
        //closePopover()
        canvas.requestPaint()
  }

    function handleMouse(e, elem, layerID, layerIndex) {
        e.preventDefault();
        //console.log("Show/Hide: ", layerID);

        switch (e.button) {

            case 0:
                //console.log("left");
                if (elem === "name") {
                    showHideLayerDetails(layerID)
                }
                if (elem === "colour") {
        
        showColourPicker(null, layerColourChange, layerIndex)

 /**                var popover_table = document.createElement("div");
                    popover_table.className = "Popover-table";
                    popover_table.id = "Popover-table";

                    var colours = [1, 2, 3, 4, 5, 6, 230, 30, 7, 8, 9, 256]

                    for (var i = 0; i < colours.length; i++) {
                        var ACIColour = document.createElement("div");
                        ACIColour.className = "Design-shape"
                        ACIColour.style.backgroundColor = getHexColour(colours[i]);
                        ACIColour.id = getHexColour(colours[i]);
                        ACIColour.onmousedown = function(e) {
                            LM.layers[layerIndex].colour = this.id;
                            console.log(this.id, " colour clicked " + layerIndex);
                            loadLayers();
                            closePopover()
                            canvas.requestPaint()

                        };

                        popover_table.appendChild(ACIColour);
                    }
                    popover_appendContent(popover_table)
          **/
                }

                break;

            case 1:
                //console.log("middle");
                break;

            case 2:
                //console.log("right");
                /*
                var listItems = [

                {
                    name: "Rename",
                    action: function() {
                        console.log("Rename layer:", LM.getLayerByIndex(layerIndex).name);
                        closePopover();
                        var edit = document.getElementById(layerID)
                        var style = getComputedStyle(document.body);
                        var colour = style.getPropertyValue('--active-colour');
                        edit.style.outline = colour + " solid 1px"
                            // set the focus on the text edit. timer needed as a hack
                        window.setTimeout(function() {
                            edit.focus();
                        }, 0);
                    }
                }, {
                    name: "Delete",
                    action: function() {
                        LM.deleteLayer(layerIndex);
                        closePopover();
                        loadLayers();
                        canvas.requestPaint();
                    }
                }
                ];
                if (LM.getCLayer() + "-layer" !== layerID) {
                    listItems.push({
                        name: "Set Current",
                        action: function() {
                            console.log("Set Current clicked layer:", layerIndex)
                            LM.setCLayer(LM.getLayerByIndex(layerIndex).name);
                            closePopover();
                            loadLayers();

                        }
                    })
                }

                popover_showList(listItems);
                */
                break
        }
    }

    function frozen(layerName, checked) {
        console.log("frozen", layerName, checked)

        for (var layer = 0; layer < layers.length; layer++) {
            if (layers[layer].name === layerName) {
                layers[layer].frozen = checked;
            }
        }
    }



    function loadLayers() {

        var list = document.getElementById("LayerManagerList")
        list.innerHTML = '';

        for (var layerIndex = 0; layerIndex < LM.layerCount(); layerIndex++) {

            var layer = LM.getLayerByIndex(layerIndex);
            var li = document.createElement("li");

            var ListItemDiv = document.createElement("div");
            ListItemDiv.className = "Design-sidebar-listitem";
            ListItemDiv.id = layerIndex;

            var layerColour = document.createElement("div");
            layerColour.className = "Design-shape";
            layerColour.id = layer.name
            layerColour.style.backgroundColor = layer.colour;

            layerColour.onmousedown = function(e) {
                handleMouse(e, "colour", this.id, this.parentElement.getAttribute('id'))
            };

            //var layerNameDiv = document.createElement("div");

            var layerNameDiv = document.createElement("Input");
            layerNameDiv.className = "layerManagerLayerName"
            layerNameDiv.type = "text"
            layerNameDiv.value = layerIndex//layer.name;
            layerNameDiv.id = layer.name + "-layer"
            layerNameDiv.onmousedown = function(e) {
                handleMouse(e, "name", this.id, this.parentElement.getAttribute('id'))
            };
            layerNameDiv.onkeydown = function(e) {
                var charCode = (e.charCode) ? e.charCode : e.keyCode;
                //if enter or escape is pressed, save the layername
                if (charCode === 13 || charCode === 27) {
                    this.style.outline = "none"
                    this.blur()
                }
            };

            layerNameDiv.onblur = function() {
                if(this.value){
                this.style.outline = "none"
                var layerIndex = this.parentElement.getAttribute('id');
                console.log("this value:", this.value)
                LM.renameLayer(layerIndex, this.value)
                }
                
                loadLayers();
            }

            var layerToggleDiv = document.createElement("div");
            layerToggleDiv.className = "LayerManagerLayerToggle"

            var toggleLabel = document.createElement("label");
            toggleLabel.className = "toggle"

            var toggle = document.createElement("Input");
            toggle.type = "checkbox"
            toggle.id = layer.name + "-toggle"
            toggle.checked = layer.on
            toggle.onclick = function() {
                //console.log("Toggle Layer " + this.id + ": " + this.checked)
                var index = this.parentElement.parentElement.parentElement.getAttribute('id')
                LM.getLayerByIndex(index).on = this.checked;
                canvas.requestPaint();

            }

            var tick = document.createElement("div");
            tick.className = "tick";

            var layerDetailsDiv = document.createElement("div");
            layerDetailsDiv.className = "layerManagerListItemDetails"
            layerDetailsDiv.id = layer.name + "-layerDetails"

            var sliderSpan = document.createElement("span");
            sliderSpan.className = "slider";

            li.appendChild(ListItemDiv)
            ListItemDiv.appendChild(layerColour);

            if (layer.name === LM.getCLayer()) {

                layerNameDiv.style.fontWeight = "bold";

                layerColourRGB = hexToRgb(layer.colour)

                if ((layerColourRGB.r * 0.299 + layerColourRGB.g * 0.587 + layerColourRGB.b * 0.114) > 186) {
                    tick.style.borderColor = "#000000"
                } else {
                    tick.style.borderColor = "#ffffff"
                }

                layerColour.appendChild(tick);
            }

            ListItemDiv.appendChild(layerNameDiv);
            //nameNode.appendChild(name);
            //layerNameDiv.appendChild(nameNode);

            /*
            renameLayerDiv.appendChild(rename);
            renameLayerDiv.appendChild(submit);
            ListItemDiv.appendChild(renameLayerDiv);
            */

            ListItemDiv.appendChild(layerToggleDiv);
            layerToggleDiv.appendChild(toggleLabel)
            toggleLabel.appendChild(toggle)
            toggleLabel.appendChild(sliderSpan)


            li.appendChild(layerDetailsDiv)

            list.appendChild(li);

        }
    }

    function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    //import this document in to the Design.html Document
    //var import1 = document.currentScript.ownerDocument.querySelector("#LayerManager");

    //document.body.appendChild(document.currentScript.ownerDocument.importNode(import1, true));



/**
 * notify
 */
  
  var notificationContent = "";

    function notify(content) {
    console.log("Notification: ", content)
    notificationContent = content;
        var notification = document.getElementById("Notification-body")
        notification.innerHTML = "<p>" + content + "</p>";
        shownotification();
    }

    function notification_appendContent(content) {
        notification_clearContent();
        var notification = document.getElementById("Notification-body");
        notification.appendChild(content);
        shownotification();
    }

    function notification_clearContent() {
        var notification = document.getElementById("Notification-body")
        notification.innerHTML = '';
    }

    function shownotification() {
        //document.getElementById('NotifyPopup').style.display = "block";
    //setTimeout(closenotification, 5000)
    }

    function closenotification() {
        document.getElementById('NotifyPopup').style.display = "none";
    notificationContent = ""
    }

//    When the user clicks anywhere outside of the dialogs, close them
 //   window.onclick = function(event) {
//        if (event.target == document.getElementById('NotifyPopup')) {
//            document.getElementById('NotifyPopup').style.display = "none";
//        }
//    }

    //import this document in to the Design.html Document
    //var import1 = document.currentScript.ownerDocument.querySelector("#NotifyPopup");
    //document.body.appendChild(document.currentScript.ownerDocument.importNode(import1, true));




    function popover_setContent(content) {
        var popover = document.getElementById("Popover-body")
        popover.innerHTML = content;
        showPopover();
    }

    function popover_appendContent(content) {
        popover_clearContent();
        var popover = document.getElementById("Popover-body");
        popover.appendChild(content);
        showPopover();
    }

   /* function popover_showList(listItems) {
    var popover_list = document.createElement("ui");
        popover_list.className = "Popover-list";
        popover_list.id = "Popover-list";

        for (var i = 0; i < listItems.length; i++) { 
            var listItem = document.createElement("li");
            listItem.appendChild(document.createTextNode(listItems[i].name))
            listItem.onmousedown = listItems[i].action;
            

            popover_list.appendChild(listItem);
        }

        popover_appendContent(popover_list)
    }*/

    function popover_clearContent() {
        var popover = document.getElementById("Popover-body")
        popover.innerHTML = '';
    }

    function showPopover(ev) {
        document.getElementById('PopoverWindow').style.display = "block";
        positionPopover(ev);
    }

    function closePopover() {
        document.getElementById('PopoverWindow').style.display = "none";
    }

    function positionPopover(ev) {
        var clickCoords = getPosition(ev);
        var clickCoordsX = clickCoords.x;
        var clickCoordsY = clickCoords.y;
        var popover = document.getElementById('Popover-body');

        popoverWidth = popover.offsetWidth + 4;
        popoverHeight = popover.offsetHeight + 4;

        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;

        if ((windowWidth - clickCoordsX) < popoverWidth) {
            popover.style.left = windowWidth - popoverWidth + "px";
        } else {
            popover.style.left = clickCoordsX - (popoverWidth / 2) + "px";
        }

        if ((windowHeight - clickCoordsY) < popoverHeight) {
            popover.style.top = windowHeight - popoverHeight - 10 + "px";
        } else {
            popover.style.top = clickCoordsY + 10 + "px";
        }
    }

    function getPosition(ev) {
        var posx = 0;
        var posy = 0;

        if (!e) var e = window.event;

        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        return {
            x: posx,
            y: posy
        }
    }

    // When the user clicks anywhere outside of the dialogs, close them
    window.onclick = function(event) {
        if (event.target == document.getElementById('PopoverWindow')) {
      console.log("CLOSE CLOSE CLOSE CLOSE")
            document.getElementById('PopoverWindow').style.display = "none";
        }
    }
  
    //import this document in to the Design.html Document
    //var import1 = document.currentScript.ownerDocument.querySelector("#PopoverWindow");
   // document.body.appendChild(document.currentScript.ownerDocument.importNode(import1, true));



/**
 * showHidePropertiesManager
 */

    function showHidePropertiesManager() {

        var PM = document.getElementById("PropertiesManager");

        if (PM.style.width > "0px") {
            closePropertiesManager();
        } else {
            closeLayerManager();
            PM.style.width = "300px";
        }
    }

    /* Set the width of the side navigation to 0 */
    function closePropertiesManager() {
        document.getElementById("PropertiesManager").style.width = "0";
    }

    function getProperties() {

        console.log(document.getElementById("PropertiesManager").style.width)
        if (document.getElementById("PropertiesManager").style.width > "0px") {
            console.log("[PropertiesManager] - getProperties()")
            if (selectionSet.length) {
                document.getElementById("PropertiesManagerPlaceHolder").style.display = "none";
                //console.log("[PropertiesManager] - getProperties() items", selectionSet)
                loadPropertyList(getItemType())
            } else {
                clearPropertiesList()
                document.getElementById("PropertiesManagerPlaceHolder").style.display = "block";
            }
        }
    }

    function getItemType() {

        //Loop through the items and get a list of item types.
        var itemTypes = [];

        if (selectionSet.length > 0) {
            for (var i = 0; i < selectionSet.length; i++) {

                var itemType = items[selectionSet[i]].type;
                //console.log(scene.items[scene.selectionSet[i]].type);

                if (itemTypes.indexOf(itemType, 0) === -1) {
                    itemTypes.push(itemType)
                        //console.log("ItemTypes: " + itemTypes.length)
                }
            }

            if (itemTypes.length > 1) {
                itemTypes.unshift("All")
            }
        }

        return itemTypes
    }

    function getItemProperties(itemType) {

        //Loop through the items and get a list of common properties.
        //console.log("Properties - Item Type: " + itemType)
        var propertiesList = [];

        if (selectionSet.length > 0) {
            for (var i = 0; i < selectionSet.length; i++) {
                //console.log("[propertiesManager.js - getItemProperties()] type:", items[selectionSet[i]].type)
                if (items[selectionSet[i]].type === itemType) {
                    var properties = items[selectionSet[i]]
                    for (var prop in properties) {
                        //console.log("Property: " + prop)
                        if (propertiesList.indexOf(prop, 0) === -1) {
                            if (typeof properties[prop] !== "function") {
                                var excludeProps = ["type", "family", "minPoints", "limitPoints", "helper_geometry", "points", "alpha"];
                                if (excludeProps.indexOf(prop) === -1) {
                                    propertiesList.push(prop)
                                }
                            }
                        }
                    }
                }
            }

            return propertiesList;
        }
    }


    function getItemPropertyValue(itemType, property) {
        //Loop through the items and get a list the property values
        var propertiesValueList = [];
        var propertyValue = ""
        if (selectionSet.length > 0) {
            for (var i = 0; i < selectionSet.length; i++) {
                if (items[selectionSet[i]].type === itemType) {
                    var prop = items[selectionSet[i]][property]
                    propertiesValueList.push(prop)                                    
                }
            }
        }
        
        console.log("[propertiesManager.getItemProperyValue()]", propertiesValueList)
        if(propertiesValueList.every(function(prop){return prop === propertiesValueList[0]})){
            return propertiesValueList[0]
        }else{
            return "varies"
        }
    }


    function clearPropertiesList() {
        var list = document.getElementById("PropertiesManagerList")
        list.innerHTML = '';
    }

    function loadPropertyList(itemList) {
        var list = document.getElementById("PropertiesManagerList")
        clearPropertiesList()

        for (var item = 0; item < itemList.length; item++) {

            var li = document.createElement("li");


            var ListItemDiv = document.createElement("div");
            ListItemDiv.className = "Design-sidebar-listitem";
            ListItemDiv.id = itemList[item];
            ListItemDiv.onmousedown = function(e) {
                showHideItemProperties(this.id)
            };

            //var nameNode = document.createElement("p")
            var type = document.createTextNode(itemList[item])
                //console.log("[propertiesManager.loadPropertyList:] ", itemList[item])

            var itemPropertiesDiv = document.createElement("div");
            itemPropertiesDiv.className = "layerManagerListItemDetails"
            itemPropertiesDiv.id = itemList[item] + "-itemProperties"


            ListItemDiv.appendChild(type);
            li.appendChild(ListItemDiv)
            li.appendChild(itemPropertiesDiv)
            list.appendChild(li);

        }
    }

    function loadItemProperties(elemID) {
        var itemType = elemID;
        var propertiesList = getItemProperties(itemType)
        var detailsDiv = document.getElementById(elemID + "-itemProperties")
            //console.log(propertiesList)
        var props = "";
        for (var property = 0; property < propertiesList.length; property++) {
            console.log("[propertiesManager.loadItemProperties()]: type:", itemType, " property: ", propertiesList[property])

            var propValue = getItemPropertyValue(itemType, propertiesList[property])
            
                        props += '\
        <div class="Design-sidebar-listitem"> \
    <div class="Design-sidebar-listitem-child"><p>' + propertiesList[property] + '</p></div>';
            
            switch (propertiesList[property]){
                    
                case "width":
                    props += '<div class="Design-sidebar-listitem-child"> <input type="text" value=' + propValue + '></div>'
                    break;
                case "height":
                    props += '<div class="Design-sidebar-listitem-child"> <input type="text" value=' + propValue + '></div>'
                    break;
                case "rotation":
                    props += '<div class="Design-sidebar-listitem-child"> <input type="text" value=' + propValue + '></div>'
                    break;    
                case "radius":
                    props += '<div class="Design-sidebar-listitem-child"> <input type="text" value=' + propValue + '></div>'
                    break;
                case "lineWidth":
                    props += '<div class="Design-sidebar-listitem-child"> <input type="text" value=' + propValue + '></div>'
                    break;
                case "colour":
                    props += '<div class="Design-sidebar-listitem-child"><select>';
                    props +=  '<option>' + propValue + '</option>'; 
                    for (var ACI = 0; ACI < 256; ACI++) {
                    props +=  '<option>' + ACI + '</option>';   
                    }
                    props += '</select></div>'; 
                    break;
                case "layer":
                    
                    props += '<div id="design-dropdown" onclick="showDD()" class="wrapper-dropdown-2">' + LM.getCLayer() + '<ul class="dropdown"> '
                           // <li><a href="#"><i class="icon-twitter icon-large"></i>Twitter</a></li> \
                        //    <li><a href="#"><i class="icon-github icon-large"></i>Github</a></li> \
                        //    <li><a href="#"><i class="icon-facebook icon-large"></i>Facebook</a></li> \
                   
                    for (var layerIndex = 0; layerIndex < LM.layerCount(); layerIndex++) {
                        if(LM.getLayerByIndex(layerIndex).name !== LM.getCLayer()){
                      props +=  '<li style="border-left-color: #38B44A">' + LM.getLayerByIndex(layerIndex).name + '</li>'; 
                    }
            }
      
                       props +=     '</ul> \
                                    </div>'
                   /* props += '<div class="Design-sidebar-listitem-child"><select>';
                    for (var layerIndex = 0; layerIndex < LM.layerCount(); layerIndex++) {
                      props +=  '<option>' + LM.getLayerByIndex(layerIndex).name + '</option>'; 
                    }
                    props += '</select></div>'; 
                    */
                    break;
                default:
                    props += '<div class="Design-sidebar-listitem-child"><p>' + propValue + '</p></div>' 
                    break;
            }
            

    
        props += '</div>';
        }
        detailsDiv.innerHTML = props;
        return propertiesList.length;
    }

    function showHideItemProperties(elemID) {
        var elem = document.getElementById(elemID + "-itemProperties")
        var elemIDstate = elem.style.display;
        console.log("[propertiesManager.js - showHideItemProperties()]:", elemID, elemIDstate)

        //hide any expanded sections

        var divs = document.querySelectorAll("[id]");
        for (var i = 0, len = divs.length; i < len; i++) {
            var div = divs[i];
            if (div.id.indexOf("itemProperties") > -1) {
                div.style.height = "0px";
                div.style.display = "none";
            }
        }

        if (elemIDstate !== "block") {
            elem.style.display = "block";
            var items = loadItemProperties(elemID);
            var height = items * 50 //TO DO: Get height from CSS
            elem.style.height = height.toString() + "px";
        }
    }


    //import this document in to the Design.html Document
    //var import1 = document.currentScript.ownerDocument.querySelector("#PropertiesManager");

    //document.body.appendChild(document.currentScript.ownerDocument.importNode(import1, true));


/**
 * loadStyleList
 */

function loadStyleList() {

        // get a list of available fonts
        getFonts();
        //set font style options
        var fontStyleSelect = document.getElementById("fontStyleSelect")

        for (i = fontStyleSelect.options.length; i >= 0; i--) {
            fontStyleSelect.remove(i);
      }

        var fontStyles = {
        1 : "Regular",
        2 : "Bold",
        3 : "Italic"
        };

        for(index in fontStyles) {
            fontStyleSelect.options[fontStyleSelect.options.length] = new Option(fontStyles[index], index);
        }



        var list = document.getElementById("StylesManagerList")
        clearStylesList()

        styles = SM.getStyles()
        
        for (var item = 0; item < styles.length; item++) {

            var li = document.createElement("li");


            var ListItemDiv = document.createElement("div");
            ListItemDiv.className = "Design-sidebar-listitem";
            ListItemDiv.id = styles[item].name;
            ListItemDiv.onmousedown = function(e) {
                loadStyleData(this.id)
            };

            var type = document.createTextNode(styles[item].name)
            ListItemDiv.appendChild(type);
            li.appendChild(ListItemDiv)
            list.appendChild(li);
        }


        //load the first style available
        loadStyleData(SM.getStyleByIndex(0).name)
    }

    function loadStyleData(styleName){

        console.log("load style: ", styleName)

        var style = SM.getStyleByName(styleName)

        var fontStyle = document.getElementById("fontSelect")
        var fontStyleSelect = document.getElementById("fontStyleSelect")
        var textHeightInput = document.getElementById("textHeightInput")
        var styleWidthFactor = document.getElementById("widthFactorInput")
        var styleObliqueAngle = document.getElementById("obliqueAngleInput")
        var styleUpsideDown = document.getElementById("upsideDownToggle")
        var styleBackwards = document.getElementById("backwardsToggle")

        console.log("StyleData: ", style)

        fontStyle.value = style.font
        fontStyleSelect.value = style.font 
        textHeightInput.value = style.textHeight
        styleWidthFactor.value = style.widthFactor
        styleObliqueAngle.value = style.obliqueAngle
        styleUpsideDown.checked = style.upsideDown
        styleBackwards.checked = style.backwards
    }

    function clearStylesList() {
        var list = document.getElementById("StylesManagerList")
        list.innerHTML = '';
    }

function updateStyle(){

    console.log("Update Style")
}

function changeColour(caller){
  console.log("Caller: ", caller)
  showColourPicker(null, settingColourChange, caller)
}

function settingColourChange(colour, caller){
  console.log("change ", caller, " to: ", colour);
  settings[caller] = colour
  saveAllSettings(settings)
  setDefaultSettings()
  canvas.requestPaint()
}


var cookieConsent = false;

var settings = {
  canvasBackgroundColour: "#E9E9E9", //"#000000",
  selectedItemsColour: "#00FF00",
  snapColour: "#FF0000",
  gridColour: "#00BFFF",
  helperGeometryColour: "#00BFFF",
  polarSnapColour: "#38B44A",
  //fontSettings
  font: "Arial",
  fontupsidedown: false,
  fontbackwards: false,
  //snapSettings
  endSnap: true,
  midSnap: true,
  centreSnap: true,
  nearestSnap: false,
  quadrantSnap: false,
  polarAngle: 5,
  polar: false,
  ortho: false,
  drawGrid: true
}
function getCookieConsent() {  
  var cookiesAllowed = getSettings("Design")
  
  if(cookiesAllowed != ""){
    cookieConsent = true;
    loadAllSettings(settings)
  } else {
    //showWelcomeWizzard();
  }
}

function cookiesAccepted(){
  cookieConsent = true;
  saveSetting("Design", designVersion, 365);
  saveAllSettings(settings)
}
/**
 * toggleSnap
 */
function toggleSnap(snap){
  settings[snap] = !settings[snap]
  saveAllSettings(settings)
    canvas.zoom(1)
}

function toggleSnapPolar(snap){
  settings[snap] = !settings[snap]
  saveAllSettings(settings)
    canvas.zoom(1)
}
function toggleSnapNearest(snap){
  settings[snap] = !settings[snap]
  saveAllSettings(settings)
    canvas.zoom(1)
}


function changePolarAngle(angle){

  console.log("Angle:", angle)
  settings["polarAngle"] = angle;
  saveAllSettings(settings);
    canvas.zoom(1)
}

function changeFont(font){
  console.log("Selected Font:", font)
  settings["font"] = font;
  saveAllSettings(settings);
}

function saveAllSettings (settings){
  if(cookieConsent){
    for (var setting in settings){
      //console.log("Setting:", setting, " value: ", settings[setting])
      saveSetting(setting, settings[setting])
    }
  } else {
    console.log("settings won't be saved")
  }
}

function loadAllSettings (settings){
  for (var setting in settings){
    //console.log("getSetting:", setting, " value: ", getSettings(setting))
    settings[setting] = getSettings(setting) 
  }
}

function saveSetting(name, value) {
  var d = new Date();
  d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getSettings(name) {
  var name = name + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


function changeTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
  
  setDefaultSettings();
}

function setDefaultSettings(){
  //set defaults
  document.getElementById("polarAngle").value = settings["polarAngle"]
  document.getElementById("canvasBackgroundColour").style.backgroundColor = settings["canvasBackgroundColour"]
  document.getElementById("selectedItemsColour").style.backgroundColor = settings["selectedItemsColour"]
  document.getElementById("snapColour").style.backgroundColor = settings["snapColour"]
  document.getElementById("helperGeometryColour").style.backgroundColor = settings["helperGeometryColour"]
  document.getElementById("polarSnapColour").style.backgroundColor = settings["polarSnapColour"]
  document.getElementById("gridColour").style.backgroundColor = settings["gridColour"]
}


function getFonts(){

  var fontDetector = function() {
    // a font will be compared against all the three default fonts.
    // and if it doesn't match all 3 then that font is not available.
    var baseFonts = ['monospace', 'sans-serif', 'serif'];

    //we use m or w because these two characters take up the maximum width.
    // And we use a LLi so that the same matching fonts can get separated
    var testString = "mmmmmmmmmmlli";

    //we test using 72px font size, we may use any size. I guess larger the better.
    var testSize = '72px';

    var h = document.getElementsByTagName("body")[0];

    // create a SPAN in the document to get the width of the text we use to test
    var s = document.createElement("span");
    s.style.fontSize = testSize;
    s.innerHTML = testString;
    var defaultWidth = {};
    var defaultHeight = {};
    for (var index in baseFonts) {
      //get the default width for the three base fonts
      s.style.fontFamily = baseFonts[index];
      h.appendChild(s);
      defaultWidth[baseFonts[index]] = s.offsetWidth; //width for the default font
      defaultHeight[baseFonts[index]] = s.offsetHeight; //height for the defualt font
      h.removeChild(s);
    }

    function detect(font) {
      var detected = false;
      for (var index in baseFonts) {
        s.style.fontFamily = font + ',' + baseFonts[index]; // name of the font along with the base font for fallback.
        h.appendChild(s);
        var matched = (s.offsetWidth != defaultWidth[baseFonts[index]] || s.offsetHeight != defaultHeight[baseFonts[index]]);
        h.removeChild(s);
        detected = detected || matched;
      }
      return detected;
    }

    this.detect = detect;
  };

  var fonts = ["Arial","Helvetica","Times New Roman","Times","Courier New","Courier","Verdana","Georgia","Palatino","Garamond","Bookman","Comic Sans MS","Trebuchet MS","Impact"];
  
  //var availableFonts = [];        
  d = new fontDetector(); 
  var fontSelector = document.getElementById('fontSelect')

  //clear the drop down
  
  var fontSelectorLength = fontSelector.options.length
  
  for (i = fontSelectorLength; i >= 0; i--) {
    //console.log("Remove Font: ", fonts[i], " From Index: ", i)
    fontSelector.remove(i);
  }     

  for(font = 0 ; font < fonts.length-1; font++){
    if (d.detect(fonts[font])){
      //availableFonts.push(fonts[font])
      var fontOption = document.createElement("option");
      fontOption.text = fonts[font]
      fontSelector.options.add(fontOption);
      //console.log("Testing Font: ", fonts[font], " Available: ", d.detect(fonts[font]))
    };    
  }
  
  //set select value
  //fontSelector.value = settings["font"]
}

function showSettings() {
  //block context menu for layer manager
  //var SW = document.getElementById("SettingsWindow");
  //SW.oncontextmenu =  function(e) {e.preventDefault()};
  document.getElementById('SettingsWindow').style.display = "block";
  document.getElementById("defaultOpen").click();
}

function closeSettings() {
  console.log("Close Settings")
  document.getElementById('SettingsWindow').style.display = "none";
}

// When the user clicks anywhere outside of the dialogs, close them
window.onclick = function(event) {
  if (event.target == document.getElementById('SettingsWindow')) {
    closeSettings();
  }
}

//import this document in to the Design.html Document
//var import1 = document.currentScript.ownerDocument.querySelector("#SettingsWindow");
//document.body.appendChild(document.currentScript.ownerDocument.importNode(import1, true));

/**
 * cookieButton
 */

var cookieButton = document.getElementById("cookieButton");

cookieButton.onclick = function(){
var cookieShape = document.getElementById("cookieShape");

cookieButton.classList.add("disabledbutton");
cookieShape.style.visibility='visible' 
cookiesAccepted()
}

function showWelcomeWizzard() {
  document.getElementById('WelcomeWizzard').style.display = "block";
}

function closeWelcomeWizzard() {
  document.getElementById('WelcomeWizzard').style.display = "none";
}

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("slides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = slides.length}    
  if (n < 1) {slideIndex = 1}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}

