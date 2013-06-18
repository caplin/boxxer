(function (_g) {
    /**
     * boxxer object
     * @public
     * @type {Object}
     */
    var boxxer = {};

    /**
     * descendant class level constructor
     * @constructor Surrogate
     */
    function Surrogate() {}

    //renderer element
    var renderer = document.createElement("div");
    //hide the renderer element to prevent unnecessary reflows
    renderer.style.display = "none";

    /**
     * determines whether boxxer should be built in debug mode
     * @return {Boolean}
     */
    function debugMode() {
        return (_g.boxxer_debug === true);
    }

    /**
     * returns the browser specific target Element in an Event object
     * @param evt {Event}
     * @returns {Object}
     */
    function getEventTarget(evt) {
        return (evt.target || evt.srcElement);
    }

    /**
     * returns the document body
     * @private
     * @static
     * @return {HTMLElement}
     */
    function getBody() {
        return document.body;
    }

    /**
     * initializes a renderer element by appending it to the DOM and hiding it
     * @param eElement {HTMLElement|undefined} parent to append the renderer element to
     */
    function init(eElement) {
        //appending invisible renderer element
        (eElement || getBody()).appendChild(renderer);
    }

    /**
     * returns the renderer element
     * @returns {HTMLElement}
     */
    function getRenderer() {
        return renderer;
    }

    /**
     * extender - inheritance resolver
     * @param subClass {Function} sub class - surprised on this?
     * @param superClass {Function} super class - the Force is strong with this one...
     */
    function inherit(subClass, superClass) {
        var TemporarySuperClass = function () {};

        if (debugMode()) {
            //I know, but I still prefer the
            //clean visual prototype chain
            //with proper class names instead
            //of "__proto__ > haku.nama.tata"
            eval("TemporarySuperClass = function " + subClass.name + "() {};");
        }

        TemporarySuperClass.prototype = superClass.prototype;

        subClass.prototype = new TemporarySuperClass();
        subClass.prototype.constructor = subClass;
    }

    /**
     * mixes two classes by their prototype
     * @param mainClass {Function} class getting partial stuff
     * @param mixClass {Function} partial class implementation
     */
    function mix(mainClass, mixClass) {
        var i;

        for (i in mixClass.prototype) {
            if (mixClass.prototype.hasOwnProperty(i)) {
                mainClass.prototype[i] = mixClass.prototype[i];
            }
        }
    }

    /**
     * registers a namespace or a class for the given path
     * @param rawPath {String} path to resolve
     * @param name {String} the property to set
     * @param value {*} whateva'...
     * @param [context] {Object} context to resolve the path on and for callback - optional
     */
    function register(rawPath, name, value, context) {
        var path = rawPath.split("."),
            currentContext = (context || boxxer),
            property;

        while (path.length > 0) {
            property = path.shift();

            if (property) {
                if(!currentContext.hasOwnProperty(property)) {
                    currentContext[property] = {};
                }
                currentContext = currentContext[property];
            }
        }

        currentContext[name] = (typeof value === "function" ?
            value((context || this), currentContext) : value);
    }

    /**
     * registers a namespace or a class for the given path
     * @param classPath {String} path to resolve
     * @param callback {Function} callback
     * @param [context] {Object} context to resolve the path on and for callback - optional
     */
    function patch(classPath, callback, context) {
        var path = classPath.split("."),
            currentContext = (context || boxxer),
            prop;

        if (typeof callback === "function") {
            while (path.length > 0 && currentContext) {
                prop = path.shift();

                if (prop) {
                    if(!currentContext.hasOwnProperty(prop)) {
                        currentContext[prop] = {};
                    }
                    currentContext = currentContext[prop];
                }
            }

            callback(currentContext);
        }
    }

    //expose registering method
    boxxer.register = register;
    boxxer.Surrogate = Surrogate;

    //expose core utility functions
    boxxer.mix = mix;
    boxxer.inherit = inherit;
    boxxer.debugMode = debugMode;

    //expose utility functions
    boxxer.utils = {
        getBody : getBody,
        getRenderer : getRenderer,
        getEventTarget : getEventTarget
    };

    if (debugMode()) {
        boxxer.utils.patch = patch;
    }

    //expose initialize function
    boxxer.init = init;

    _g.boxxer = boxxer;
}(window));
boxxer.register("view", "ViewContainer", function (b) {
    /**
     * abstract class to maintain custom user views inside Box and Panel instances
     * @constructor ViewContainer
     */
    ViewContainer = function ViewContainer(box) {
        this.box = box;
    };

    /**
     * renders the ViewContainer, invoked when the Panel or Box finished rendering
     * @param element {HTMLElement}containing element
     */
    ViewContainer.prototype.render = function (element) {};

    /**
     * serializes the ViewContainer
     * @returns {string}
     */
    ViewContainer.prototype.serialize = function () {
        return '\"\"';
    };

    return b.view.View = ViewContainer;
});
boxxer.register("", "Dialog", function (b) {
    /**
     * @param [view] {View}
     * @param [callback] {Function}
     * @param [context] {Object}
     * @constructor Dialog
     */
    function Dialog(view, callback, context) {
        var element = document.createElement("div");
        element.style.position = "absolute";

        this.element = element;
        this.view = view;
        this.width = 0;
        this.height = 0;
        this.openContext = context || this;
        this.openCallback = callback;
    }

    /**
     * opens the Dialog
     * @param [view] {View}
     * @param [width] {Number}
     * @param [height] {Number}
     */
    Dialog.prototype.open = function (view, width, height) {
        var element = this.element;
        var viewContent = (view || this.view).render(element);
        var tempElement;

        element.style.width = (this.width || width) + "px";
        element.style.height = (this.height || height) + "px";

        if (typeof this.openCallback === "function") {
            this.openCallback.call(this.openContext || this, this);
        }

        if (viewContent) {
            if (viewContent instanceof Node) {
                element.appendChild(viewContent);
            } else if (typeof viewContent === "string") {
                tempElement = document.createElement("div");
                tempElement.innerHTML = viewContent;
                //append content wrapper firstChildElement
                element.appendChild(tempElement.firstElementChild);
            }
        }
    };

    return b.Dialog = Dialog;
});

boxxer.register("decorator", "Decorator", function (b) {

    /**
     * @constructor Decorator
     */
    function Decorator() {}

    /**
     * method needs to be overwritten!
     *
     * applies (engages) the decorator when the Box has been rendered
     *
     * @param box {boxxer.Box}
     * @param template {HTMLElement}
     * @returns {Decorator}
     */
    Decorator.prototype.engage = function (box, template) {
        return this;
    };

    /**
     * returns a predefined template
     * @param box {boxxer.Box}
     * @returns {HTMLElement}
     */
    Decorator.prototype.getTemplate = function (box) {
        return document.createElement("div");
    };

    /**
     * registry for every decorator
     * @static
     * @type {{}}
     */
    Decorator.registry = {};

    /**
     * determines whether a decorator has already been registered
     * @param decoratorName {String} name of the decorator
     * @returns {Boolean}
     */
    Decorator.isRegistered = function (decoratorName) {
        return Decorator.registry.hasOwnProperty(decoratorName);
    };

    /**
     * returns the required decorator
     * @param decoratorName {String}
     * @returns {Decorator}
     */
    Decorator.getDecorator = function (decoratorName) {
        return Decorator.registry[decoratorName];
    };

    /**
     * creates a new decorator instance to decorate
     * @param prototype
     * @returns {Decorator}
     */
    Decorator.extend = function (prototype) {
        var decorator = new Decorator();
        var property;

        for (property in prototype) {
            if (prototype.hasOwnProperty(property)) {
                decorator[property] = prototype[property];
            }
        }

        return decorator;
    };

    /**
     * creates and registers a new decorator
     * @param name {String} name of the Decorator
     * @param prototype {Object} map containing the applied functionality
     * @returns {Decorator|undefined}
     */
    Decorator.register = function (name, prototype) {
        var registry = Decorator.registry;
        var decorator;

        if (name !== '' && !registry.hasOwnProperty(name)) {
            decorator = Decorator.extend(prototype);
            registry[name] = decorator;
        }

        return decorator;
    };

    b.decorator.Decorator = Decorator;
    b.createDecorator = Decorator.register;

    return Decorator;
});
boxxer.register("mixins", "Adjustable", function (b) {
    /**
     * @constructor Adjustable mixin class provides the required dimension handler methods
     */
    function Adjustable() {}

    /**
     * @returns {boxxer.render.Dimension}
     */
    Adjustable.prototype.getWidth = function () {
        return this.width;
    };

    /**
     * @returns {boxxer.render.Dimension}
     */
    Adjustable.prototype.getHeight = function () {
        return this.height;
    };

    /**
     * sets the width
     * @param width {String|Number}
     */
    Adjustable.prototype.setWidth = function (width) {
        this._setElementWidth(parseInt(width));
    };

    /**
     * sets the height
     * @param height {String|Number}
     */
    Adjustable.prototype.setHeight = function (height) {
        this._setElementHeight(parseInt(height));
    };

    /**
     * sets both width and height
     * @param width {String|Number}
     * @param height {String|Number}
     */
    Adjustable.prototype.setDimensions = function (width, height) {
        this.setWidth(width);
        this.setHeight(height);
    };

    b.mixins.Adjustable = Adjustable;

    return Adjustable;
});
boxxer.register("mixins", "ElementWrapper", function (b) {
    /**
     * @constructor ElementWrapper
     */
    function ElementWrapper() {
        /**
         * the HTMLElement of the Box instance - DOM
         * @private
         * @type {HTMLDivElement}
         */
        this._element = document.createElement("div");
    }

    /**
     * @param width {Number}
     * @private
     */
    ElementWrapper.prototype._setElementWidth = function (width) {
        this.getElement().style.width = (width + "px");
    };

    /**
     * @param height {Number}
     * @private
     */
    ElementWrapper.prototype._setElementHeight = function (height) {
        this.getElement().style.height = (height + "px");
    };

    /**
     * returns the DOM Element of the Box
     * @return {HTMLElement}
     */
    ElementWrapper.prototype.getElement = function () {
        return this._element;
    };

    /**
     * adds a class to the HTMLElementWrapper if it isn't
     * @param className {String} class name to add
     */
    ElementWrapper.prototype.addClass = function (className) {
        var attribute = this.getElement().getAttribute("class"),
            classes = (attribute ? attribute.split(" ") : []);

        if (classes.indexOf(className) < 0) {
            classes.push(className);
            this.getElement()
                .setAttribute("class", classes.join(" "));
        }
    };

    /**
     * determines whether the Box DOM Element's class attribute contains the specified string
     * @param className {String} class name to add
     */
    ElementWrapper.prototype.hasClass = function (className) {
        return this.getElement().getAttribute("class").indexOf(className) > -1;
    };

    /**
     * returns an attribute of the DOM Element of the Box
     * @param attribute {String} name of the attribute
     * @return {String}
     */
    ElementWrapper.prototype.getAttribute = function (attribute) {
        return (this.getElement().getAttribute(attribute) || "");
    };

    /**
     * sets an attribute of the DOM Element of the Box
     */
    ElementWrapper.prototype.setAttribute = function (attribute, value) {
        this.getElement()
            .setAttribute(attribute, (value || "").toString());
    };

    /**
     * returns a data attribute of the DOM Element of the Box
     * @param attribute {String} name of the attribute
     * @return {String}
     */
    ElementWrapper.prototype.getDataAttribute = function (attribute) {
        return this.getElement().getAttribute("data-" + attribute);
    };

    /**
     * sets a data attribute on the DOM Element of the Box
     * @param attribute {String} name of the attribute
     * @param value {*} any serializable Object (implements or overrides toString() )
     */
    ElementWrapper.prototype.setDataAttribute = function (attribute, value) {
        this.getElement()
            .setAttribute("data-" + attribute, value);
    };

    /**
     * sets or returns the text content of the Box instance
     * @param sText {String} name of the attribute
     * @return {String|undefined}
     */
    ElementWrapper.prototype.text = function (sText) {
        var element = this.getElement();

        if (typeof sText !== "string") {
            return element.innerText;
        } else {
            element.innerText = sText;
        }
    };

    /**
     * sets or returns the html content of the Box instance
     * @param html {String} name of the attribute
     * @return {String|undefined}
     */
    ElementWrapper.prototype.html = function (html) {
        var element = this.getElement();

        if (typeof html !== "string") {
            return element.innerHTML;
        } else {
            element.innerHTML = html;
        }
    };

    //temporary exposition of namespace for WebStorm/IntelliJ object member visibility support
    b.mixins.ElementWrapper = ElementWrapper;

    return ElementWrapper;
});
boxxer.register("mixins", "ParentElementWrapper", function (b) {
    /**
     * @constructor ParentElementWrapper
     * @param parent {HTMLElement}
     */
    function ParentElementWrapper(parent) {
        /**
         * the HTMLElement - DOM
         * @private
         * @type {Object}
         */
        this._parentElement = parent;
    }

    /**
     * returns the parent DOM Element of the Box
     * @return {HTMLElement}
     */
    ParentElementWrapper.prototype.getParentElement = function () {
        return (this._parentElement || b.utils.getBody());
    };

    /**
     * sets the parent DOM Element of the Box
     * @param parent {HTMLElement} the parent DOM HTMLElementWrapper
     */
    ParentElementWrapper.prototype.setParentElement = function (parent) {
        var element = this.getElement();
        if (element.parentElement !== parent && this._parentElement !== parent) {
            this._parentElement = parent;
            this._parentElement.appendChild(element);
        }
    };

    //temporary exposition of namespace for WebStorm/IntelliJ object member visibility support
    b.mixins.ParentElementWrapper = ParentElementWrapper;

    return ParentElementWrapper;
});
boxxer.register("mixins", "Serializer", function (b) {

    /**
     * @constructor provides serializer method for each Box instance to serialize their state
     * @mixin
     * @static
     */
    function Serializer() {}

    /**
     * serializes a hierarchy of Box instances
     * @param format {String} either "xml" or "json"
     * @param name {String} the name of the Box instance in the collection
     * @returns {String}
     */
    Serializer.prototype.serialize = function (format, name) {
        var serializedBox;

        if (format === Serializer.JSON) {
            serializedBox = Serializer.toJSON(this, name);
        } else {
            serializedBox = Serializer.toXML(this, name);
        }

        return serializedBox;
    };

    /**
     * serializes the given Box instance to JSON format
     * @param box {boxxer.Box} the Box to serialize
     * @param name {String} the name of the Box instance in the collection
     * @returns {string}
     */
    Serializer.toJSON = function (box, name) {
        var child;
        var children;
        var view = box.view;
        var childCount = box.getChildCount();
        var decorators = box.getDecorators();
        var json = "{" +
            "\"id\":" + Number(box.getId().replace("boxxer:box_", "")) + "," +
            "\"flow\":\"" + box.getFlowDirection() + "\"," +
            Serializer.getJSONAttributes(box);

        if (typeof name === "string" && name !== "") {
            json += ",\"name\":\"" + name + "\"";
        }

        if (decorators.length > 0) {
            json += ",\"decorators\":[";
            json += decorators.join(",");
            json +="]";
        }

        if (childCount > 0) {
            json += ",\"children\":[";
            children = box.getChildren();

            for (child in children) {
                if (children.hasOwnProperty(child)) {
                    json += children[child].serialize(Serializer.JSON, child);
                    childCount--;

                    if (childCount > 0) {
                        json += ",";
                    }
                }
            }

            json += "]";
        }

        if (view instanceof b.view.View) {
            json += ", view:" + view.serialize();
        }

        json += "}";

        return json;
    };

    /**
     * serializes the given Box instance to XML format
     * @param box {boxxer.Box} the Box to serialize
     * @param name {String} the name of the Box instance in the collection
     * @returns {string}
     */
    Serializer.toXML = function (box, name) {
        var child;
        var children;
        var decorators = box.getDecorators();
        var xml = "<boxxer:box" +
            " id='" + Number(box.getId().replace("boxxer:box_", "")) + "'" +
            " flow='" + box.getFlowDirection() + "'";

        if (typeof name === "string" && name !== "") {
            xml += " name='" + name + "'";
        }

        xml += Serializer.getXMLAttributes(box) + ">";

        if (decorators.length > 0) {
            xml += " decorators='";
            xml += decorators.join(",");
            xml +="'";
        }

        if (box.getChildCount()) {
            children = box.getChildren();

            for (child in children) {
                if (children.hasOwnProperty(child)) {
                    xml += children[child].serialize(Serializer.XML, child);
                }
            }
        }

        xml += "</boxxer:box>";

        return xml;
    };

    /**
     * returns the dimension attributes for the given Box instance for JSON format
     * @param box {boxxer.Box}
     * @returns {string}
     */
    Serializer.getJSONAttributes = function (box) {
        return "\"width\":" + box.getWidth().getSerializedValue() + "," +
            "\"height\":" + box.getHeight().getSerializedValue() + "";
    };

    /**
     * returns the dimension attributes for the given Box instance for XML format
     * @param box {boxxer.Box}
     * @returns {string}
     */
    Serializer.getXMLAttributes = function (box) {
        return " width='" + box.getWidth().getSerializedValue() + "' " +
            "height='" + box.getHeight().getSerializedValue() + "'";
    };

    /**
     * deserializes the serialized Box hierarchy
     * @param serialized {String} hierarchy of Boxes
     * @returns {Object|Element}
     */
    Serializer.deserialize = function (serialized) {
        var div;
        var box;
        var test;
        var result;
        var format;

        try {
            test = JSON.parse(serialized);

            if (test instanceof Object) {
                format = Serializer.JSON;
                result = test;
            }
        } catch (e) {
            div = document.createElement("div");
            div.innerHTML = serialized;
            box = (div.firstElementChild || div.children[0]);

            if (box && box.tagName.toLowerCase() === "boxxer:box" ||
                (box.scopeName === "boxxer" && box.tagName === "box")) {
                format = Serializer.XML;
                result = box;
            }
        }

        if (result !== undefined) {
            result = Serializer.buildHierarchy(result, format);
        }

        return result;
    };

    /**
     * constructs and returns a hierarchy of box instances based on the arguments
     * @param hierarchy {Object|Element}
     * @param format {String}
     * @returns {boxxer.Box|undefined}
     */
    Serializer.buildHierarchy = function (hierarchy, format) {
        var box;
        var childBox;
        var decorators;
        var child;
        var i;

        if (format === Serializer.JSON) {
            box = new b.Box();
            box.setFlowDirection(hierarchy.flow);
            box.setWidth(hierarchy.width);
            box.setHeight(hierarchy.height);

            if (hierarchy.decorators) {
                decorators = hierarchy.decorator.replace(" ", "").split(",");

                while (decorators.length > 0) {
                    box.addDecorator(decorators.shift());
                }
            }

            if (hierarchy.children && hierarchy.children.length > 0) {
                for (i = 0; i < hierarchy.children.length; i++) {
                    child = hierarchy.children[i];
                    childBox = box.addBox(Serializer.buildHierarchy(child, format), child.name);
                }
            }
        } else if (format === Serializer.XML) {
            box = new b.Box();

            box.setFlowDirection(hierarchy.getAttribute("flow"));
            box.setWidthDimension(hierarchy.getAttribute("width"));
            box.setHeightDimension(hierarchy.getAttribute("height"));

            if (hierarchy.getAttribute("decorators")) {
                decorators = hierarchy.getAttribute("decorators").replace(" ", "").split(",");

                while (decorators.length > 0) {
                    box.addDecorator(decorators.shift());
                }
            }

            if (hierarchy.children && hierarchy.children.length) {
                for (i = 0; i < hierarchy.children.length; i++) {
                    child = hierarchy.children[i];
                    childBox = box.addBox(Serializer.buildHierarchy(child, format), child.getAttribute("name"));
                }
            }
        }

        return box;
    };

    /**
     * @static
     * @type {string}
     */
    Serializer.XML = "xml";

    /**
     * @static
     * @type {string}
     */
    Serializer.JSON = "json";

    //temporary exposition of namespace for WebStorm/IntelliJ object member visibility support
    b.mixins.Serializer = Serializer;

    return Serializer;
});

boxxer.register("async", "Connection", function (b) {

    /**
     * @description Connection class is responsible to handle all asynchronous Box persistence
     * @param url {String}
     * @param params {Object}
     * @constructor Connection
     */
    function Connection(url, params) {
        this._url = url;
        this._data = params.data || "";
        this._callback = params.callback;
        this._request = new XMLHttpRequest(); //IE7+
    }

    /**
     * method will be invoked on each state change on the request object
     */
    Connection.prototype.onStateChange = function () {
        var request = this._request;
        var args;

        if (typeof this._callback === "function") {
            if (request.readyState === 4 && request.status === 200) {
                args = Array.prototype.slice(arguments);
                args.unshift(request, request.responseText);

                this._callback.apply(null, args);
            }
        }
    };

    /**
     * Send a "POST" request
     */
    Connection.prototype.save = function() {
        this._request.onreadystatechange = this.onStateChange.bind(this);
        this._request.open(Connection.POST, this._url, true);
        this._request.send(this._data);
    };
    /**
     * Send a "PUT" request
     */
    Connection.prototype.create = function() {
        this._request.onreadystatechange = this.onStateChange.bind(this);
        this._request.open(Connection.PUT, this._url, true);
        this._request.send(this._data);
    };

    /**
     * Send a DELETE request
     */
    Connection.prototype.remove = function(){
        this._request.onreadystatechange = this.onStateChange.bind(this);
        this._request.open(Connection.DELETE, this._url, true);
        this._request.send();
    };

    /**
     * Send a GET request
     */
    Connection.prototype.get = function(){
        this._request.onreadystatechange = this.onStateChange.bind(this);
        this._request.open(Connection.GET, this._url, true);
        this._request.send();
    };

    /**
     * PUT request
     * @type {string}
     */
    Connection.PUT = "PUT";

    /**
     * DELETE request
     * @type {string}
     */
    Connection.DELETE = "DELETE";

    /**
     * POST request
     * @type {string}
     */
    Connection.POST = "POST";

    /**
     * GET request
     * @type {string}
     */
    Connection.GET = "GET";

    //temporary exposition of namespace for WebStorm/IntelliJ object member visibility support
    b.async.Connection = Connection;

    return Connection;
});
boxxer.register("layouts", "Layout", function (b) {

    function Layout() {

    }

    Layout.prototype.getLayout = function() {
        var callback = function(rawData) {
            var data = JSON.parse(rawData.responseText);
            var layout = data.layout;
            var box = b.mixins.Serializer.deserialize(layout);
            this.addBox(box);
        }.bind(this);

        new b.async.Connection(Layout.URL + "/" + this.getId(), {
            callback: callback
        }).get();
    };

    Layout.prototype.saveLayout = function(name) {
        var layout = this.serialize(b.mixins.Serializer.JSON, name || null);
        new b.async.Connection(Layout.URL + "/" + this.getId(), {
            data: layout
        }).save();
    };

    Layout.prototype.deleteLayout = function() {
        new b.async.Connection(Layout.URL + this.getId())
            .remove();
    };

//    Layout.URL = "http://localhost:666/layout";
    Layout.URL = window.location.href + "/layout";

    b.layouts.Layout = Layout;

    return Layout;
});
boxxer.register("events", "BoxEvent", function (b) {
    /**
     * BoxEvent subscription class
     * @param eventType {String} the event type which the event is subscribed
     * @param fallback {Function} callback to execute
     * @param context {Object} custom context
     * @constructor BoxEvent
     */
    function BoxEvent(eventType, fallback, context) {
        this._eventType = eventType;
        this._callback = fallback;
        this._context = context;
        this._muted = false;
        this._id = ('event_' + BoxEvent._id++);
    }

    /**
     * executes the Event instance if the object s not muted
     */
    BoxEvent.prototype.execute = function () {
        if (!this.isMuted()) {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(this.getEventType());

            this._callback.apply(this._context, args);
        }
    };

    /**
     * returns the id of the Event
     * @return {Number}
     */
    BoxEvent.prototype.getId = function () {
        return this._id;
    };

    /**
     * returns the type which the event is registered to
     * @return {String}
     */
    BoxEvent.prototype.getEventType = function () {
        return this._eventType;
    };

    /**
     * mutes the Event - does not let the Event to execute
     */
    BoxEvent.prototype.mute = function () {
        this._muted = true;
    };

    /**
     * unmutes the Event
     */
    BoxEvent.prototype.unmute = function () {
        this._muted = false;
    };

    /**
     * determines whether the Event is muted or not
     * @return {Boolean}
     */
    BoxEvent.prototype.isMuted = function () {
        return this._muted;
    };

    /**
     * @private
     * @static
     * @type {Number}
     */
    BoxEvent._id = 0;

    //temporary exposition of namespace for WebStorm/IntelliJ object member visibility support
    b.events.BoxEvent = BoxEvent;

    return BoxEvent;
});
boxxer.register("events", "EventEmitter", function (b) {
    /**
     * @constructor EventEmitter instances are able to register and emit events
     */
    function EventEmitter() {
        /**
         * map to store event types and Events by their ids
         * @private
         * @type {Object}
         */
        this._eventTypes = {};

        /**
         * map to store muted event types as keys
         * @private
         * @type {Object}
         */
        this._mutedTypes = {};
    }

    /**
     * @private
     * registers an event type
     * @param eventType {String}
     * @return {Object}
     */
    EventEmitter.prototype._createEventType = function (eventType) {
        if (!this._eventTypes.hasOwnProperty(eventType)) {
            this._eventTypes[eventType] = {};
        }

        return this._eventTypes[eventType];
    };

    /**
     * registers an Event
     * @param eventType {String} event type
     * @param callback {Function} callback method
     * @param context {Object} custom context
     * @return {BoxEvent}
     */
    EventEmitter.prototype.on = function (eventType, callback, context) {
        var event = new b.events.BoxEvent(eventType, callback, (context || this));

        this._createEventType(eventType)[event.getId()] = event;

        return event;
    };

    /**
     * un-registers the Event
     * @param event {BoxEvent} Event instance
     */
    EventEmitter.prototype.off = function (event) {
        if (!(event instanceof b.events.BoxEvent)) {
            throw new TypeError("Cannot un-register a non-Event type object...");
        }

        delete this._eventTypes[event.getEventType()][event.getId()];
    };

    /**
     * mutes an event type
     * @param eventType {String} event type
     */
    EventEmitter.prototype.mute = function (eventType) {
        this._mutedTypes[eventType] = true;
    };

    /**
     * mutes an event type
     * @param eventType {String} event type
     */
    EventEmitter.prototype.unmute = function (eventType) {
        delete this._mutedTypes[eventType];
    };

    /**
     * determines whether an event type is muted or not
     * @param eventType {String} event type
     */
    EventEmitter.prototype.isMuted = function (eventType) {
        return this._mutedTypes.hasOwnProperty(eventType);
    };

    /**
     * executes all registered Events for an even type
     */
    EventEmitter.prototype.emit = function () {
        var args = Array.prototype.slice.call(arguments),
            eventType = args.shift(),
            eventTypes = this._eventTypes[eventType],
            event,
            id;

        if (!this.isMuted(eventType)) {
            for (id in eventTypes) {
                if (eventTypes.hasOwnProperty(id)) {
                    event = eventTypes[id];
                    event.execute.apply(event, args);
                }
            }
        }
    };

    /**
     * @static
     * @type {String}
     */
    EventEmitter.ON_RENDER = "render";

    /**
     * @static
     * @type {String}
     */
    EventEmitter.ON_UPDATE = "update";

    //temporary exposition of namespace for WebStorm/IntelliJ object member visibility support
    b.events.EventEmitter = EventEmitter;

    return EventEmitter;
});

boxxer.register("render", "Dimension", function (b) {

    /**
     * @param arg
     * @constructor Dimension class is used and responsible for
     * managing the rendered width or height of a Box instance.
     *
     * Each Box instance should have a width and a height
     * Dimension instance which will calculate its own pixel/percent/weight
     * values during the rendering process
     *
     * Every sizing calculation and info should be stored here instead of the Box class!
     */
    function Dimension(arg) {
        var parsed = this._parse(arg);
        var value = parseInt(parsed.value);

        /**
         * @private
         * @type {Number}
         */
        this._minValue = b.Box.MIN_DIMENSION;

        /**
         * @private
         * @type {Number}
         */
        this._value = (!!value ? value : 1);

        /**
         * @private
         * @type {String}
         */
        this._type = undefined;

        switch (parsed.type) {
            case "%":
                this._type = Dimension.PERCENT;
                break;
            case "px":
                this._type = Dimension.PIXEL;
                break;
            default:
                this._type = Dimension.WEIGHT;
        }
    }

    /**
     * parses the given argument
     * @private
     * @param value {String}
     * @returns {{value: {Number}, type: {String}}
     */
    Dimension.prototype._parse = function (value) {
        var result = (value || "").toString().split(/(\%|px)/);
        return {
            value: result[0],
            type: result[1]
        }
    };

    /**
     * returns the type of the Dimension instance
     * @public
     * @returns {string}
     */
    Dimension.prototype.getType = function () {
        return (this._type || "");
    };

    /**
     * returns the minimum value of the Dimension instance
     * @public
     * @returns {Number}
     */
    Dimension.prototype.getMinimumValue = function () {
        return this._minValue;
    };

    /**
     * returns the value of the Dimension instance
     * @public
     * @returns {Number}
     */
    Dimension.prototype.getValue = function () {
        return this._value;
    };

    /**
     * calculates the proper value for an specified dimension and/or for a maximum weight
     * @public
     * @param availableSize {Number} total dimension to compare the Dimension values to
     * @param [totalWeight] {Number} * optional - maximum weight
     * @returns {Number}
     */
    Dimension.prototype.calculate = function (availableSize, totalWeight) {
        var type = this.getType();
        var value = this.getValue();
        var hideSnapDimension = 5;
        var minValue = parseInt(this._parse(this.getMinimumValue()).value);
        var result = value;

        if (availableSize <= hideSnapDimension && type === Dimension.WEIGHT) {
            result = 0;
        } else {
            switch (type) {
                case Dimension.PERCENT:
                    result = availableSize * (value / 100);
                    break;
                case Dimension.WEIGHT:
                    if (value > totalWeight) {
                        value = totalWeight;
                    }

                    result = (availableSize / totalWeight) * value;
                    break;
            }

            if (result < minValue) {
                result = minValue;
            }
        }

        return Math.floor(result);
    };

    /**
     * Returns the serialized value of the Dimension
     * @returns {String}
     */
    Dimension.prototype.getSerializedValue = function () {
        var type = this.getType();
        var serialized = this.getValue();

        if (type !== Dimension.WEIGHT) {
            serialized += this.getType();
        }

        return serialized;
    };

    /**
     * @static
     * @type {string}
     */
    Dimension.PERCENT = "%";

    /**
     * @static
     * @type {string}
     */
    Dimension.WEIGHT = "weight";

    /**
     * @static
     * @type {Number}
     */
    Dimension.DEFAULT_WEIGHT = 1;

    /**
     * @static
     * @type {string}
     */
    Dimension.PIXEL = "px";

    b.render.Dimension = Dimension;

    return Dimension;
});
boxxer.register("", "Box", function (b) {
    var regPrefix = "boxxer:box_";
    var mixins = b.mixins;

    /**
     * @constructor Abstract class that provides the basic attributes for each Box instance
     * @param width {String|Number}
     * @param height {String|Number}
     * @param parent {HTMLElement|undefined}
     */
    function Box(width, height, parent) {
        //mixin constructors
        mixins.ElementWrapper.call(this);
        mixins.ParentElementWrapper.call(this, parent);
        b.events.EventEmitter.call(this);

        /**
         * name of the Box
         * @private
         * @type {Object}
         */
        this._id = Box.generateUniqueBoxId();

        /**
         * @private
         * @type {Object}
         */
        this._children = {};

        /**
         * property for boxxer.view.View instance to serialize
         * @type {boxxer.view.View|undefined}
         */
        this.view = undefined;

        /**
         * width of the Box
         * @type {b.render.Dimension}
         */
        this.width = new b.render.Dimension(width);

        /**
         * height of the Box
         * @type {b.render.Dimension}
         */
        this.height = new b.render.Dimension(height);

        /**
         * array of decorator names to apply after rendering
         * @private
         * @type {Array}
         */
        this._decorators = [];

        /**
         * the direction inside the Box
         * @private
         * @type {Object}
         */
        this._flowDirection = Box.FLOW_VERTICAL;

        /**
         * @private
         * @type {Boolean}
         */
        this.isRendered = false;

        //initialize Box
        this.addClass("boxxer-Box");
        this.setDataAttribute("box-id", this.getId());

        //registering Box
        Box._registry[this.getId()] = this;
    }

    b.mix(Box, mixins.Adjustable);
    b.mix(Box, mixins.ElementWrapper);
    b.mix(Box, mixins.ParentElementWrapper);

    b.mix(Box, b.layouts.Layout);
    b.mix(Box, mixins.Serializer);
    b.mix(Box, b.events.EventEmitter);

    /**
     * adds the decorator specified to the Box instance
     * @param decoratorName {String}
     * @returns {Box}
     */
    Box.prototype.addDecorator = function (decoratorName) {
        this._decorators.push(decoratorName);
        return this;
    };

    /**
     * returns the decorators registered for the Box instance
     * @returns {Array}
     */
    Box.prototype.getDecorators = function () {
        return this._decorators;
    };

    /**
     * return the flow direction of the box
     * @returns {Object}
     */
    Box.prototype.getFlowDirection = function () {
        return this._flowDirection;
    };

    /**
     * Set the flow direction for the box
     * @param flowDirection {String}
     */
    Box.prototype.setFlowDirection = function (flowDirection) {
        this._flowDirection = (flowDirection || Box.FLOW_HORIZONTAL);
    };

    /**
     * creates a new Dimension for width property
     * @param value {string|Number}
     */
    Box.prototype.setWidthDimension = function (value) {
        this.width = new b.render.Dimension(value);
    };

    /**
     * creates a new Dimension for width property
     * @param value {string|Number}
     */
    Box.prototype.setHeightDimension = function (value) {
        this.height = new b.render.Dimension(value);
    };

    /**
     * adds a new child to the current box instance
     * @param width {Number|String} width argument
     * @param height {Number|String} width argument
     * @param name {String} name of the new instance in the collection
     * @returns {Box}
     */
    Box.prototype.addChild = function (width, height, name) {
        var box = new Box(width, height, this.getElement());
        return this.addBox(box, name);
    };

    /**
     * adds the given Box to the children
     * @param name {String} the child's name
     * @param box {Box} the child Box
     * @return {Box}
     */
    Box.prototype.addBox = function (box, name) {
        if (!(box instanceof Box)) {
            throw new TypeError("Argument is not a Box!");
        }

        box.setParentElement(this.getElement());

        this.getChildren()[name || box.getId()] = box;

        return box;
    };

    /**
     * returns the Box name
     * @return {String}
     */
    Box.prototype.getId = function () {
        return this._id;
    };

    /**
     * returns a child from the BoxSet
     * @param name {String} the name of the child
     * @return {Box}
     */
    Box.prototype.getChild = function (name) {
        return this.getChildren()[name];
    };

    /**
     * returns the children
     * @return {Object}
     */
    Box.prototype.getChildren = function () {
        return this._children;
    };

    /**
     * returns the number of children the Box has
     * @return {Number}
     */
    Box.prototype.getChildCount = function () {
        return Object.keys(this.getChildren()).length;
    };

    /**
     * removes a child Box
     * @param name {String} the name of the child
     */
    Box.prototype.removeChild = function (name) {
        var children = this.getChildren();
        children[name].close();
        delete children[name];
    };

    /**
     * Render the box and its children to the document
     */
    Box.prototype.render = function () {
        var parent = this.getParentElement();
        var boxId = parent.getAttribute("data-box-id");
        var parentBox = Box.getById(boxId);
        var eventType = b.events.EventEmitter.ON_RENDER;
        var flowDirection;

        if (parentBox instanceof Box) {
            flowDirection = parentBox.getFlowDirection();
        }

        b.render.BoxRenderer.render(this, parent, flowDirection);

        //TODO: trigger events regarding whether the Box has already been rendered (render/change)
        if (this.isRendered) {
            eventType = b.events.EventEmitter.ON_UPDATE;
        } else {
            this.isRendered = true;
        }

        this.emit(eventType);
    };

    /**
     * @static
     * @type {Number}
     */
    Box.MIN_DIMENSION = "100px";

    /**
     * @static
     * @type {String}
     */
    Box.FLOW_VERTICAL = "vertical";

    /**
     * @static
     * @type {String}
     */
    Box.FLOW_HORIZONTAL = "horizontal";

    /**
     * @static
     * @type {Object}
     */
    Box._registry = {};

    /**
     * static counter for Box ids
     * @static
     * @private
     * @type {Number}
     */
    Box._id = 0;

    /**
     * generates a unique "box_[...]"id
     * @static
     * @return {String}
     */
    Box.generateUniqueBoxId = function () {
        return regPrefix + Box._id++;
    };

    /**
     * removes a Box from the registry
     * @param sId {String} id of the Box to remove
     */
    Box.removeBox = function (sId) {
        delete Box._registry[sId];
    };

    /**
     * returns a registered Box from the registry
     * @param sId {String} the Box id
     * @return {Box}
     */
    Box.getById = function (sId) {
        return Box._registry[sId];
    };

    /**
     * cleans up the Box.s_oRegistry
     */
    Box.clean = function () {
        Box._id = 0;
        Box._registry = {};
    };

    b.Box = Box;

    return Box;
});
boxxer.register("render", "BoxRenderer", function (b) {
    var Box = b.Box;
    var Decorator = b.decorator.Decorator;
    var FLOW_HORIZONTAL = Box.FLOW_HORIZONTAL;
    var FLOW_VERTICAL = Box.FLOW_VERTICAL;

    /**
     * @constructor this class (singleton) is responsible for rendering a Box instance and its child Box instances recursively
     */
    function BoxRenderer() {}

    /**
     * set the given element as an inline-block element
     * @param element {HTMLElement}
     */
    BoxRenderer.prototype.setElementInline = function (element) {
        element.style.display = "inline-block";
        element.style.verticalAlign = "top";
    };

    /**
     * renders a given Box instance to the DOM
     * @param box {Box} Box to render
     * @param parent {HTMLElement} the parent HTMLElement to render in
     * @param flowDirection {String} the direction of the flow inside the parent
     */
    BoxRenderer.prototype.render = function (box, parent, flowDirection) {
        if (!(box instanceof b.Box)) {
            throw new TypeError("Invalid argument - not a box!");
        }

        var element = box.getElement();
        var view = box.view;

        // TODO: apply overflow: auto when the Box instance current size
        // is smaller then the total width of the child FixBox instances
        // otherwise the layout collapses
        // eElement.style.overflow = "auto";

        if (typeof flowDirection === "undefined" ||
            typeof parent === "undefined")
        {
            parent = box.getParentElement();
            flowDirection = box.getFlowDirection();

            if (flowDirection === b.Box.FLOW_HORIZONTAL) {
                this.setElementInline(element);
            }

            box.setDimensions(parent.offsetWidth, parent.offsetHeight);
        } else {
            if (flowDirection === b.Box.FLOW_HORIZONTAL) {
                this.setElementInline(element);
            }
        }

        /* TODO:
         *    We might want to separate the update and the render methods.
         *
         *    Reason:
         *        Event subscriptions. We would be able to separate event subscriptions
         *        for both the render and the update events
         *
         * do not append if already appended - makes perfect sense...
         */
        if (element.parentNode !== parent) {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }

            parent.appendChild(element);
        }

        if (!box.isRendered) {
            this._applyDecorators(box);
        }

        this._postRender(box, view, element, flowDirection);
    };

    /**
     * applies (engages) the added decorators for a Box
     * @private
     * @param box {Box}
     * @returns {BoxRenderer}
     */
    BoxRenderer.prototype._applyDecorators = function (box) {
        var decorator, template;
        var decorators = box.getDecorators();
        var length = decorators.length;
        var i = 0;

        for (; i < length; i++) {
            decorator = Decorator.getDecorator(decorators[i]);
            template = decorator.getTemplate(box);

            decorator.engage(box, template);
        }

        return this;
    };

    /**
     * render after the Box instance itself has been rendered
     * @private
     * @param box {Box}
     * @param view {View}
     * @param element {HTMLElement}
     * @param flowDirection {String}
     */
    BoxRenderer.prototype._postRender = function (box, view, element, flowDirection) {
        var viewContent;
        var tempElement;

        if (box.getChildCount()) {
            this._renderChildren(box, element, flowDirection);
        }

        //TODO: test this part because this has been implemented quickly!
        if (view instanceof b.view.View) {
            viewContent = view.render(element);

            if (viewContent) {
                if (viewContent instanceof Node) {
                    element.appendChild(viewContent);
                } else if (typeof viewContent === "string") {
                    tempElement = document.createElement("div");
                    tempElement.innerHTML = viewContent;
                    //append content wrapper firstChildElement
                    element.appendChild(tempElement.firstElementChild);
                }
            }
        }
    };

    /**
     * prepares the child Box instances and all the required properties  for rendering
     * @private
     * @param box {Box}
     * @param element {HTMLElement}
     * @param flowDirection {String}
     */
    // the real percentage values based on the element size, therefore weight
    // dimensions cannot work properly with percentage dimensions
    BoxRenderer.prototype.resolveAndSortChildren = function (box, element, flowDirection) {
        var order = [];
        var isHorizontal = flowDirection === FLOW_HORIZONTAL;
        var property = (isHorizontal ? "width" : "height");
        var elementDimension = element["offset" + (isHorizontal ? "Width" : "Height")];
        var children = box.getChildren();
        var pxBoxes = {}, pcBoxes = {}, wBoxes = {};
        var percents = 0, pixels = 0, weights = 0;
        var dimension, child, c;

        for (c in children) {
            if (children.hasOwnProperty(c)) {
                child = children[c];
                dimension = child[property];

                switch (dimension.getType()) {
                    case b.render.Dimension.PERCENT:
                        pcBoxes[c] = child;
                        percents += Math.floor(elementDimension * (dimension.getValue() / 100));
                        break;
                    case b.render.Dimension.PIXEL:
                        pxBoxes[c] = child;
                        pixels += dimension.getValue();
                        break;
                    default:
                        wBoxes[c] = child;
                        weights += dimension.getValue();
                }

                order.push(c);
            }
        }

        return {
            order: order,
            method: (flowDirection === FLOW_VERTICAL ? "Width" : "Height"),
            dimension: (flowDirection === FLOW_HORIZONTAL ? "Width" : "Height"),
            pixelBoxes: pxBoxes,
            percentBoxes: pcBoxes,
            weightBoxes: wBoxes,
            percents: percents,
            weights: weights,
            pixels: pixels
        }
    };

    /**
     * renders the children of the Box
     * @private
     * @param box {Box}
     * @param element {HTMLElement}
     * @param flowDirection {String}
     */
    BoxRenderer.prototype._renderChildren = function (box, element, flowDirection) {
        var sorted = this.resolveAndSortChildren(box, element, flowDirection);
        var children = box.getChildren();
        var order = sorted.order;
        var WEIGHT = b.render.Dimension.WEIGHT;
        var stretch,
            total,
            dimensionType,
            available,
            width,
            height,
            calculatedWidth,
            calculatedHeight,
            child;

        //taking the proper dimension from the parent to stretch to and count with
        if (flowDirection === FLOW_HORIZONTAL) {
            stretch = element.offsetHeight;
            total = element.offsetWidth;
        } else {
            stretch = element.offsetWidth;
            total = element.offsetHeight;
        }

        //available space for weighted flexible dimensions
        available = total - sorted.percents - sorted.pixels;

        while (order.length > 0) {
            child = children[order.shift()];
            width = child.width;
            height = child.height;

            //calculating dimensions based on the dimension type
            if (flowDirection === FLOW_HORIZONTAL) {
                dimensionType = width.getType();
                //if the dimension is weighted, use the available space, otherwise use the total
                calculatedWidth = width.calculate(
                    dimensionType === WEIGHT ? available : total, sorted.weights);
                calculatedHeight = height.calculate(stretch, 1);
            } else {
                dimensionType = height.getType();
                calculatedWidth = width.calculate(stretch, 1);
                //if the dimension is weighted, use the available space, otherwise use the total
                calculatedHeight = height.calculate(
                    dimensionType === WEIGHT ? available : total, sorted.weights);
            }

            //setting the dimensions
            child.setDimensions(calculatedWidth, calculatedHeight);
            child.render();
        }
    };

    //temporary exposition of namespace for WebStorm/IntelliJ object member visibility support
    b.render.BoxRenderer = BoxRenderer;

    return new BoxRenderer();
});
boxxer.createDecorator("DragDecorator", {
    engage: function (box, template) {
//        console.log("DragDecorator", box, template);
    }
});
boxxer.createDecorator("DropDecorator", {
    engage: function (box, template) {
//        console.log("DropDecorator", box, template);
    }
});
boxxer.createDecorator("HeaderDecorator", {
    //engages custom template for Box
    engage: function (box, template) {
        var element = box.getElement();
        element.style.position = "relative";
        element.appendChild(template);

        console.log(element);
    },
    //returns custom template
    getTemplate: function (box) {
        var h5 = document.createElement("h5"),
            header = document.createElement("header");

        header.setAttribute("class", "HeaderDecorator");
        header.innerHTML = box.getId();
        header.style.position = "absolute";
        header.style.left = "0px";
        header.style.top = "0px";

        return header;
    }
});
boxxer.register("decorator", "Decorator", function (b) {

    /**
     * @constructor Decorator
     */
    function Decorator() {}

    /**
     * method needs to be overwritten!
     *
     * applies (engages) the decorator when the Box has been rendered
     *
     * @param box {boxxer.Box}
     * @param template {HTMLElement}
     * @returns {Decorator}
     */
    Decorator.prototype.engage = function (box, template) {
        return this;
    };

    /**
     * returns a predefined template
     * @param box {boxxer.Box}
     * @returns {HTMLElement}
     */
    Decorator.prototype.getTemplate = function (box) {
        return document.createElement("div");
    };

    /**
     * registry for every decorator
     * @static
     * @type {{}}
     */
    Decorator.registry = {};

    /**
     * determines whether a decorator has already been registered
     * @param decoratorName {String} name of the decorator
     * @returns {Boolean}
     */
    Decorator.isRegistered = function (decoratorName) {
        return Decorator.registry.hasOwnProperty(decoratorName);
    };

    /**
     * returns the required decorator
     * @param decoratorName {String}
     * @returns {Decorator}
     */
    Decorator.getDecorator = function (decoratorName) {
        return Decorator.registry[decoratorName];
    };

    /**
     * creates a new decorator instance to decorate
     * @param prototype
     * @returns {Decorator}
     */
    Decorator.extend = function (prototype) {
        var decorator = new Decorator();
        var property;

        for (property in prototype) {
            if (prototype.hasOwnProperty(property)) {
                decorator[property] = prototype[property];
            }
        }

        return decorator;
    };

    /**
     * creates and registers a new decorator
     * @param name {String} name of the Decorator
     * @param prototype {Object} map containing the applied functionality
     * @returns {Decorator|undefined}
     */
    Decorator.register = function (name, prototype) {
        var registry = Decorator.registry;
        var decorator;

        if (name !== '' && !registry.hasOwnProperty(name)) {
            decorator = Decorator.extend(prototype);
            registry[name] = decorator;
        }

        return decorator;
    };

    b.decorator.Decorator = Decorator;
    b.createDecorator = Decorator.register;

    return Decorator;
});