(function () {

var global = this;
/**
 * boxxer object
 * @type {Object}
 */
var exports = {};

/**
 * boxxer API object
 * @type {Object}
 * @namespace
 */
var api = Object.create(exports);

/**
 * old boxxer
 * @type {Object}
 */
var _boxxer = global.boxxer;

/**
 * renderer element
 * @type {HTMLElement}
 */
var renderer = document.createElement("div");
//hide the renderer element to prevent unnecessary reflows
renderer.style.display = "none";

if (_boxxer) {
    exports._boxxer = _boxxer;
}

//export API object
global.boxxer = api;

/**
 * descendant class level constructor
 * @constructor Surrogate
 */
function Surrogate() {}

/**
 * determines whether boxxer should be built in debug mode
 * @return {Boolean}
 */
function debugMode() {
    return (global.boxxer_debug === true);
}

/**
 * removes an element from its parent element
 * @param element {HTMLElement}
 */
function removeElement(element) {
    var parent = element.parentNode;

    if (parent) {
        parent.removeChild(element);
    }
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

//expose registering method
exports.Surrogate = Surrogate;

//expose core utility functions
exports.mix = mix;
exports.inherit = inherit;
exports.debugMode = debugMode;

//expose utility functions
exports.utils = {
    getBody : getBody,
    getRenderer : getRenderer,
    getEventTarget : getEventTarget,
    removeElement: removeElement
};

//expose initialize function
exports.init = init;
exports.Async = Async;

/**
 * provides save mixin method for Box instances for asynchronous state saving
 * @constructor Async
 */
function Async() {}

/**
 * method gets merged to the implementor class
 * @returns {*}
 */
Async.prototype.save = function (url, callback, format, method) {
    return Async.saveBox(this, url, method, callback, format);
};

/**
 * serializes and saves the given Box instance
 * @param box {boxxer.Box}
 * @param url {String}
 * @param [method] {String} GET/POST
 * @param [callback] {Function}
 * @param [format] {String}
 */
Async.saveBox = function (box, url, method, callback, format) {
    if (!format) {
        format = Serializer.JSON;
    }

    new Connection(box, url, method, format, callback).save();
};

/**
 * PUT request
 * @type {string}
 */
Async.POST = "PUT";

/**
 * DELETE request
 * @type {string}
 */
Async.POST = "DELETE";

/**
 * POST request
 * @type {string}
 */
Async.POST = "POST";

/**
 * GET request
 * @type {string}
 */
Async.GET = "GET";

exports.Connection = Connection;

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

exports.Component = Component;

/**
 * @interface
 * @class
 * This interface must be implemented by a presentation-level class.
 * A presentation-level class represents something that occupies physical space in the page
 * container, such as the content of a panel or a dialog box. <code>Component</code> extends the
 * {@link Lifecycle} interface which defines the life cycle events that may be raised by the container
 * in response to the user's interaction with it. The <code>Component</code> is automatically registered
 * with its container so that it receives these life cycle event callbacks.
 *
 * <p>Each implementation of a Component represents a different <b>Component type</b>,
 * for example a Grid or a Trade Panel.</p>
 *
 * <p>Each subclass of <code>Component</code> must have an createFromSerializedState method
 * which is responsible for constructing new instances of the Component.
 *
 * <p>The windowing environment, which provides the container within which the component exists,
 * may only use a subset of the <code>Component</code> interface. A component therefore should be
 * implemented so that it will work even if the (mandatory) methods {@link #getElement} and
 * {@link LifeCycle#onOpen} are the only methods the windowing environment will invoke.</p>
 *
 * <p>The windowing environment determines whether the event methods are called immediately after
 * or immediately before the event they refer to.</p>
 *
 * <p><code>Component</code> instances that have been configured via XML or saved as part of a
 * layout are instantiated by the ComponentFactory. As such a
 * <code>Component</code> must be registered with the using the factory's
 * ComponentFactory.registerComponent method, passing
 * in the name of the root XML tag that represents the component and a suitable static factory
 * method can instantiate it.
 * @constructor
 *
 * @implements LifeCycle
 * @component
 */
function Component() {}

/**
 * Returns a reference to the container that is hosting this component. If no container has been
 * set then this will return undefined.
 *
 * @deprecated
 * @return {Box} The box hosting this component.
 */
Component.prototype.getContainer = function () {
    return this.container;
};

/**
 * Provides a reference to the container that will be hosting this component.
 *
 * @deprecated
 * @see #setFrame
 * @param {box} box The container hosting this component.
 */
Component.prototype.setContainer = function (box) {
    this.container = box;
};

/**
 * Just leaving it for now just in case but not sure we need it
 * @deprecated
 */
Component.prototype.setFrame = Component.prototype.setContainer;

/**
 * Gets a guaranteed ID for this component instance.
 * @type String
 * @return A unique ID
 * @throws {Error} if this method is not implemented by the subclass.
 */
// TODO do we need this as boxes have an ID? I guess so but need to look into it
Component.prototype.getUniqueComponentId = function () {
    throw new Error("Component.getUniqueComponentId() has not been implemented.");
};

/**
 * Invoked when the windowing environment needs to display this component. It returns the HTML
 * element that must be added to the DOM to represent this component. <code>getElement()</code>
 * is invoked before any of the other <code>Component</code> interface methods.
 *
 * <p>This method is compulsory, and must be implemented.</p>
 *
 * <p>It should be designed execute quickly, as the windowing environment may freeze
 * until it has returned.</p>
 *
 * @type HtmlElement
 * @return The root <code>HtmlElement</code> used to display this component on a web page.
 * Must not be <code>null</code> or <code>undefined</code>.
 * @throws {Error} if this method is not implemented by the subclass.
 */
Component.prototype.getElement = function () {
    throw new Error("Component.getElement() has not been implemented.");
};

/**
 * Invoked when the windowing environment needs to save the state of this component. It returns an
 * XML string or JSON object representation of the state.
 *
 * <p>This method is compulsory, and must be implemented.</p>
 *
 * <p>Example:</p>
 *
 * <pre>
 * mybank.MyComponent = function()
 * {
 *	this.m_sSubject = null;
 * };
 * caplin.implement(mybank.MyComponent, Component);
 *
 * mybank.MyComponent.setSubject = function(sSubject)
 * {
 *	this.m_sSubject = sSubject;
 * };
 *
 * // other Component methods ...
 *
 * mybank.MyComponent.getSerializedState = function()
 * {
 *	return "&lt;myComponent subject=\"" + this.m_sSubject + "\" /&gt;";
 * };
 * </pre>
 *
 * @type String
 * @return An XML string representation of the state of this component.
 * Must not be <code>null</code> or <code>undefined</code>.
 * @throws {Error} if this method is not implemented by the subclass.
 */
// TODO update jsdoc with JSON example instead of XML
Component.prototype.getSerializedState = function () {
    throw new Error("Component.getSerializedState() has not been implemented.");
};

/**
 * Invoked so the container can determine whether the component is currently permissioned for use.
 *
 * @return The set of permissioning information that can be used to query
 * {@link caplin.services.security.PermissionService#canUserPerformAction}.
 * @type caplin.services.security.PermissionKey
 */
// TODO Something with this...
Component.prototype.getPermissionKey = function () {};

exports.LifeCycle = LifeCycle;

/**
 * @beta
 * @class
 * <p>Component life cycle events are emitted by the box instances. Overriding any of the methods
 * in this listener interface is optional, but doing so will enable you to react to the related
 * event.</p>
 *
 * @constructor
 * @interface
 */
function LifeCycle() {}

/**
 * Invoked when the frame is first displayed. It will only ever be called once when the box instance is rendered to the
 * document so that dimensions can be calculated.
 *
 * @param {int} nWidth The width of the frame, in pixels.
 * @param {int} nHeight The height of the frame, in pixels.
 */
LifeCycle.prototype.onOpen = function(nWidth, nHeight) {};

/**
 * Invoked when the frame containing this component is closed.
 *
 * <p>This method should be used to clean up any resources the component currently has open,
 * including subscriptions and any other listeners that may have been registered. Once
 * <code>onClose()</code> has been called no further methods will be called for this
 * component.</p>
 *
 * <p>It is possible for the <code>onClose()</code> method to be invoked before
 * <code>onOpen()</code> if the component was instantiated but never displayed (for example if the
 * user was not permissioned to view the component) in which case this method should only be used
 * to clean up any resources it has opened within its constructor, and not those that it would
 * have opened within <code>onOpen()</code>.</p>
 */
LifeCycle.prototype.onClose = function() {};

/**
 * Invoked when a box that has been hidden (see {@link #onHide}) is now back in view. It
 * should restore any resources that were stopped or suspended by <code>onHide()</code>.
 *
 * <p>Note that this method is not called when the component within the frame is first
 * displayed (see {@link #onOpen}).</p>
 */
LifeCycle.prototype.onShow = function() {};

/**
 * Invoked when a frame is no longer in view. It should stop or suspend any resources that may
 * be processor intensive, such as subscriptions, so they are not active whilst the
 * frame is hidden.
 *
 * @see #onShow
 */
LifeCycle.prototype.onHide = function() {};

/**
 * Invoked when the frame has been minimized.
 *
 * @see #onRestore
 */
LifeCycle.prototype.onMinimize = function() {};

/**
 * Invoked when the frame has been maximized.
 *
 * @see #onRestore
 */
LifeCycle.prototype.onMaximize = function() {};

/**
 * Invoked when the frame has been restored from a minimized or maximized state.
 *
 * @see #onMinimize
 * @see #onMaximize
 */
LifeCycle.prototype.onRestore = function() {};

/**
 * Invoked when the dimensions of the frame change.
 *
 * @param {int} nWidth The new width of the frame, in pixels.
 * @param {int} nHeight The new height of the frame, in pixels.
 */
LifeCycle.prototype.onResize = function(nWidth, nHeight) {};

/**
 * Invoked when the frame becomes the active or focused frame within the page.
 */
// TODO this is not ideal as API onFocus would be better but we can create an alias
LifeCycle.prototype.onActivate = function() {};

/**
 * Invoked when the frame ceases to be the active or focused frame within the page.
 */
// TODO this is not ideal as API onBlur would be better but we can create an alias
LifeCycle.prototype.onDeactivate = function() {};

/**
 * Invoked when the frame ceases to be the active or focused frame within the page.
 */
LifeCycle.prototype.onFlowChange = function() {};
exports.Decorator = Decorator;

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

    //initialize decorator once
    if (typeof decorator.init === "function") {
        decorator.init();
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

exports.createDecorator = Decorator.register;

exports.BoxEvent = BoxEvent;

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

exports.EventEmitter = EventEmitter;

/**
 * EventEmitter instances are able to register and emit events
 * @constructor EventEmitter
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
    var event = new BoxEvent(eventType, callback, (context || this));

    this._createEventType(eventType)[event.getId()] = event;

    return event;
};

/**
 * un-registers the Event
 * @param event {BoxEvent} Event instance
 */
EventEmitter.prototype.off = function (event) {
    if (!(event instanceof BoxEvent)) {
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
 * Fired when the box is rendered
 * @static
 * @type {String}
 */
// TODO Link to LifeCycle#onOpen is a component is present
EventEmitter.ON_RENDER = "render";

/**
 * Fired when the box is updated
 * @static
 * @type {String}
 */
// TODO Add LifeCycle equivalent
EventEmitter.ON_UPDATE = "update";

/**
 * Fired when the box is shown
 * @static
 * @type {String}
 */
// TODO Link to LifeCycle#onShow
EventEmitter.ON_SHOW = "show";

/**
 * Fire when the box is hidden
 * @static
 * @type {String}
 */
// TODO Link to LifeCycle#onHide
EventEmitter.ON_HIDE = "hide";

/**
 * Fired when the box is resized
 * @static
 * @type {String}
 */
// TODO Link to LifeCycle#onResize
EventEmitter.ON_RESIZE = "resize";

/**
 * Fired when the box flow is changed
 * @static
 * @type {String}
 */
// TODO Add LifeCycle equivalent
EventEmitter.ON_FLOW = "flow";

/**
 * Fired when the box gain focus
 * @static
 * @type {String}
 */
// TODO Link to LifeCycle#onActivate
EventEmitter.ON_FOCUS = "focus";

/**
 * Fired when the box loses focus
 * @static
 * @type {String}
 */
// TODO Link to LifeCycle#onDeactivate
EventEmitter.ON_FOCUS = "blur";

/**
 * Fired when the box is restored
 * @static
 * @type {String}
 */
// TODO Implement restore
// TODO Link to LifeCycle#onRestore
EventEmitter.ON_RESTORE = "restore";

/**
 * Fired when the box is minimized
 * @static
 * @type {String}
 */
// TODO implemement minimize
// TODO Link to LifeCycle#onDeactivate
EventEmitter.ON_MINIMIZE = "minimize";

/**
 * Fired when the box is maximized
 * @static
 * @type {String}
 */
// TODO implement maximize
// TODO Link to LifeCycle#onDeactivate
EventEmitter.ON_MAXIMIZE = "maximize";

exports.Layout = Layout;

/**
 * Abstract class that extend box instance and provide layout persistence
 * @constructor Layout
 */
function Layout() {}

/**
 * Return the path for the layout
 * @returns {*}
 */
Layout.prototype.getLayoutPath = function() {
    return this.getName() || this.getId();
};

/**
 * Retrieve a layout from the back-end
 */
Layout.prototype.getLayout = function() {
    var callback = function(rawData) {
        var data = JSON.parse(rawData.responseText);
        var layout = data.layout;
        var box = Serializer.deserialize(layout);

        this.addBox(box);
    }.bind(this);

    new Connection(Layout.URL + "/" + this.getLayoutPath(), {
        callback: callback
    }).get();
};

/**
 * Save a layout in the back-end
 * @param name
 */
Layout.prototype.saveLayout = function(name) {
    var layout = this.serialize(Serializer.JSON, name || null);

    new Connection(Layout.URL + "/" + this.getLayoutPath(), {
        data: layout
    }).save();
};

/**
 * Delete a layout from the back-end
 */
Layout.prototype.deleteLayout = function() {
    new Connection(Layout.URL + this.getLayoutPath()).remove();
};

/**
 * Path to the layouts API
 * @type {string}
 */
Layout.URL = window.location.href + "/layout";

exports.Manager = Manager;

/**
 * Seperate class which aim to facilitate managing multiple layouts
 * @constructor
 */
function Manager() {}

exports.Adjustable = Adjustable;

/**
 * Adjustable mixin class provides the required dimension handler methods
 * @name Adjustable
 * @constructor
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

exports.BoxComponent = BoxComponent;

/**
 * @name BoxComponent
 * Component adapter class to provide ComponentLifeCycleEvents for the Component inside the Box
 * @param component {Component|undefined}
 * @constructor BoxComponent
 */
function BoxComponent(component) {
    /**
     * @type {Component|undefined}
     */
    this.component = component;
}

/**
 * sets the component on the Box instance
 * @param component {Component}
 * @returns {Box}
 */
BoxComponent.prototype.setComponent = function (component) {

    if (component) {
        this.component = component;
    }

    return this;
};

/**
 * returns the Component
 * @returns {Component}
 */
BoxComponent.prototype.getComponent = function () {
    return this.component;
};

/**
 * invokes onOpen or onResize for the Component inside the Box
 * instance depending whether the Box has been rendered or not.
 * @param box {Box}
 * @returns {Box}
 */
BoxComponent.render = function (box) {

    var component = box.getComponent();
    var element;

    if (component) {
        element = box.getElement();
        BoxComponent.invoke(!box.isRendered ? "onOpen" : "onResize", box, [element.offsetWidth, element.offsetHeight]);
    }

    return this;
};

/**
 * Invokes a onEvent method on a component if it is present
 * @param methodName {String} Method name to invoke on the component
 * @param box {Box}
 * @param [args] {Array} Optional array of arguments to pass to the method being invoked
 */
BoxComponent.invoke = function(methodName, box, args) {
    var component = box.getComponent();

    if (component && component[methodName]) {
        component[methodName].apply(component, args || []);
    }

    return box;
};

/**
 * invokes onClose for the Component inside the Box instance
 * @param box {Box}
 * @returns {Box}
 */
BoxComponent.destroy = function (box) {
    BoxComponent.invoke("onClose", box, []);
};

/**
 * invokes onFlowChange for the Component inside the Box instance
 * @param box
 * @returns {*}
 */
BoxComponent.flowChange = function(box) {
    BoxComponent.invoke("onFlowChange", box, []);
};

/**
 * invokes onMaximize for the Component inside the Box instance
 * @param box
 * @returns {*}
 */
BoxComponent.maximize = function(box) {
    BoxComponent.invoke("onMaximize", box, []);
};

/**
 * invokes onMinimize for the Component inside the Box instance
 * @param box
 * @returns {*}
 */
BoxComponent.minimize = function(box) {
    BoxComponent.invoke("onMinimize", box, []);
};

/**
 * invokes onRestore for the Component inside the Box instance
 * @param box
 * @returns {*}
 */
BoxComponent.restore = function(box) {
    BoxComponent.invoke("onRestore", box, []);
};

exports.ElementWrapper = ElementWrapper;

/**
 * @name ElementWrapper
 * @constructor
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
    return this;
};

/**
 * @param height {Number}
 * @private
 */
ElementWrapper.prototype._setElementHeight = function (height) {
    this.getElement().style.height = (height + "px");
    return this;
};

/**
 * Set new dimension for the elements
 * @param width {Number}
 * @param height {Number}
 * @private
 */
ElementWrapper.prototype.setElementDimension = function (width, height) {
    this._setElementWidth(width);
    this._setElementHeight(height);
    return this;
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

    return this;
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
    if (value) {
        this.getElement()
            .setAttribute(attribute, value.toString());
    }

    return this;
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
    if (value) {
        this.getElement()
            .setAttribute("data-" + attribute, value);
    }

    return this;
};

/**
 * sets or returns the text content of the Box instance
 * @param text {String} name of the attribute
 * @return {String|undefined}
 */
ElementWrapper.prototype.text = function (text) {
    var element = this.getElement();

    if (typeof text !== "string") {
        return element.innerText;
    } else {
        element.innerText = text;
    }

    return this;
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

    return this;
};

/**
 * Hide the HTML representation of the Box instance
 */
ElementWrapper.prototype.hide = function () {
    this.getElement().style.display = 'none';
    BoxComponent.hide(this);
    this.emit(EventEmitter.ON_HIDE);
    return this;
};

/**
 * Show the HTML representation of the Box instance
 */
ElementWrapper.prototype.show = function () {
    this.getElement().style.display = '';
    BoxComponent.show(this);
    this.emit(EventEmitter.ON_SHOW);
    return this;
};

/**
 * Toggle the visibility of the Box instance
 */
ElementWrapper.prototype.toggle = function () {
    return (this.getElement().style.display === 'none') ? this.show() : this.hide();
};

/**
 * Maximize the visual representation of the Box instance
 */
// TODO do we handle maximizing to a parent only instead of document?
ElementWrapper.prototype.maximize = function () {
    this.setElementDimension(document.width, document.height);
    return this;
};

/**
 * Minimize the visual representation of the Box instance
 */
// TODO implement
ElementWrapper.prototype.minimize = function () {
    return this;
};

/**
 * Restore the visual representation of the Box instance to its original configuration
 */
// TODO implement
ElementWrapper.prototype.restore = function () {
    this.render();
    return this;
};

exports.ParentElementWrapper = ParentElementWrapper;

/**
 * @name ParentElementWrapper
 * @constructor
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
    return (this._parentElement || getBody());
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

    return this;
};

exports.Serializer = Serializer;

/**
 * Provides serializer method for each Box instance to serialize their state
 * @constructor Serializer
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
        "\"id\":" + Number(box.getId().replace("bbox_", "")) + "," +
        "\"flow\":\"" + box.getFlowDirection() + "\"," +
        Serializer.getJSONAttributes(box);

    name = name || box.getName() || null;

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

    if (view instanceof ViewContainer) {
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
    var xml = "<bbox" +
        " id='" + Number(box.getId().replace("bbox_", "")) + "'" +
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

    xml += "</bbox>";

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

        if (box && box.tagName.toLowerCase() === "bbox") {
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
    var box = new Box();
    var childBox;
    var decorators;
    var child;
    var i;

    if (format === Serializer.JSON) {
        box = new Box();
        box.setFlowDirection(hierarchy.flow);
        box.setWidth(hierarchy.width);
        box.setHeight(hierarchy.height);
        box.addClass(hierarchy.class);

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
        box.setFlowDirection(hierarchy.getAttribute("flow"));
        box.setWidthDimension(hierarchy.getAttribute("width"));
        box.setHeightDimension(hierarchy.getAttribute("height"));
        box.addClass(hierarchy.getAttribute("class"));

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

exports.Data = Data;

function Data() {
    this.url = "/persist";
}

exports.BoxRenderer = BoxRenderer;

/**
 * This class is responsible for rendering a Box instance and its child Box instances recursively
 * @static
 * @constructor BoxRenderer
 */
function BoxRenderer() {}

/**
 * set the given element as an inline-block element
 * @param element {HTMLElement}
 */
BoxRenderer.setElementInline = function (element) {
    element.style.display = "inline-block";
    element.style.verticalAlign = "top";
};

/**
 * renders a given Box instance to the DOM
 * @param box {Box} Box to render
 * @param parent {HTMLElement} the parent HTMLElement to render in
 * @param flowDirection {String} the direction of the flow inside the parent
 */
BoxRenderer.render = function (box, parent, flowDirection) {
    if (!(box instanceof Box)) {
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

        if (flowDirection === Box.FLOW_HORIZONTAL) {
            BoxRenderer.setElementInline(element);
        }

        box.setDimensions(parent.offsetWidth, parent.offsetHeight);
    } else {
        if (flowDirection === Box.FLOW_HORIZONTAL) {
            BoxRenderer.setElementInline(element);
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
        BoxRenderer._applyDecorators(box);
    }

    BoxRenderer._postRender(box, view, element);
};

/**
 * applies (engages) the added decorators for a Box
 * @private
 * @param box {Box}
 */
BoxRenderer._applyDecorators = function (box) {
    var decorator, template;
    var decorators = box.getDecorators();
    var length = decorators.length;
    var i = 0;

    for (; i < length; i++) {
        decorator = Decorator.getDecorator(decorators[i]);
        template = decorator.getTemplate(box);

        decorator.engage(box, template);
    }
};

/**
 * render after the Box instance itself has been rendered
 * @private
 * @param box {Box}
 * @param view {ViewContainer}
 * @param element {HTMLElement}
 */
BoxRenderer._postRender = function (box, view, element) {
    var viewContent;
    var tempElement;

    if (box.getChildCount()) {
        this._renderChildren(box, element, box.getFlowDirection());
    }

    //TODO: test this part because this has been implemented quickly!
    if (view instanceof ViewContainer) {
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
BoxRenderer.resolveAndSortChildren = function (box, element, flowDirection) {
    var order = [];
    var isHorizontal = flowDirection === Box.FLOW_HORIZONTAL;
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
                case Dimension.PERCENT:
                    pcBoxes[c] = child;
                    percents += Math.floor(elementDimension * (dimension.getValue() / 100));
                    break;
                case Dimension.PIXEL:
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
        method: (flowDirection === Box.FLOW_VERTICAL ? "Width" : "Height"),
        dimension: (flowDirection === Box.FLOW_HORIZONTAL ? "Width" : "Height"),
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
BoxRenderer._renderChildren = function (box, element, flowDirection) {
    var sorted = this.resolveAndSortChildren(box, element, flowDirection);
    var children = box.getChildren();
    var order = sorted.order;
    var WEIGHT = Dimension.WEIGHT;
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
    if (flowDirection === Box.FLOW_HORIZONTAL) {
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
        if (flowDirection === Box.FLOW_HORIZONTAL) {
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

exports.Dimension = Dimension;

/**
 * @param arg
 * class is used and responsible for managing the rendered width or height of a Box instance.
 *
 * Each Box instance should have a width and a height
 * Dimension instance which will calculate its own pixel/percent/weight
 * values during the rendering process
 *
 * Every sizing calculation and info should be stored here instead of the Box class!
 * @constructor Dimension
 */
function Dimension(arg) {
    var parsed = this._parse(arg);
    var value = parseInt(parsed.value);

    /**
     * @private
     * @type {Number}
     */
    this._minValue = Box.MIN_DIMENSION;

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

exports.ViewContainer = ViewContainer;

/**
 * class to maintain custom user views inside Box and Panel instances
 * @constructor ViewContainer
 */
function ViewContainer(parent) {
    this.box = new Box(1, 1, parent);
}

/**
 * returns the Box in the ViewContainer
 * @returns {Box}
 */
ViewContainer.prototype.getBox = function () {
    return this.box;
};

/**
 * renders the ViewContainer, invoked when the Panel or Box finished rendering
 */
ViewContainer.prototype.render = function () {
    return this.box.render().getElement();
};

/**
 * destroys the ViewContainer and the contained Box
 */
ViewContainer.prototype.destroy = function () {
    return this.box.destroy();
};

/**
 * serializes the ViewContainer
 * @returns {string}
 */
ViewContainer.prototype.serialize = function () {
    return '\"\"';
};
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
exports.Dialog = Dialog;

/**
 * @param [width] {Number|String}
 * @param [height] {Number|String}
 * @param [left] {Number|String}
 * @param [right] {Number|String}
 * @constructor Dialog
 */
function Dialog(width, height, left, right) {
    ElementWrapper.call(this);
    Adjustable.call(this);

    var element = this.getElement();
    element.setAttribute("class", "boxxer-Dialog");
    element.style.position = "absolute";

    renderer.appendChild(element);
    renderer.removeChild(element);

    this.container = undefined;
    this.width = new Dimension(width);
    this.height = new Dimension(height);
    this.left = left || Dialog.CENTER;
    this.right = right || Dialog.CENTER;
    this.viewContainer = new ViewContainer(element);
}

mix(Dialog, ElementWrapper);
mix(Dialog, Adjustable);

/**
 * opens the Dialog
 * @return {Dialog}
 */
Dialog.prototype.open = function () {
    var element = this.getElement();
    var container = this.container || getBody();
    var availableWidth = container.offsetWidth;
    var availableHeight = container.offsetHeight;
    var width = this.width.calculate(availableWidth, 1);
    var height = this.height.calculate(availableHeight, 1);

    this.setWidth(width);
    this.setHeight(height);

    element.style.left = ((availableWidth / 2) - (width / 2)) + "px";
    element.style.top = ((availableHeight / 2) - (height / 2)) + "px";

    this.renderViewContent(element);

    container.appendChild(element);

    return this;
};

/**
 * sets the container of the Dialog instance
 * @param container {Box|HTMLElement}
 * @returns {Dialog}
 */
Dialog.prototype.setContainer = function (container) {
    if (!(container instanceof Box || container instanceof HTMLElement)) {
        throw new TypeError("Container must be a Box or a HTMLElement instance!");
    }

    this.container = container;

    return this;
};

/**
 * renders the ViewContent into the Dialog
 * @param element {HTMLElement}
 */
Dialog.prototype.renderViewContent = function (element) {
    var viewContent = this.viewContainer.render();
    var tempElement;

    if (viewContent) {
        if (viewContent instanceof Node) {
            element.appendChild(viewContent);
        } else if (typeof viewContent === "string") {
            tempElement = document.createElement("div");
            tempElement.innerHTML = viewContent;

            element.appendChild(tempElement.firstElementChild);
        }
    }
};

/**
 * closes the dialog and destroys the Box
 */
Dialog.prototype.close = function () {
    this.viewContainer.destroy();
    removeElement(this.getElement());
};

/**
 * @static
 * @type {String}
 */
Dialog.CENTER = "center";

exports.Box = Box;

/**
 * Abstract class that provides the basic attributes for each Box instance
 * @constructor Box
 * @param width {String|Number}
 * @param height {String|Number}
 * @param parent {HTMLElement|undefined}
 */
function Box(width, height, parent) {
    //mixin constructors
    ElementWrapper.call(this);
    ParentElementWrapper.call(this, parent);
    EventEmitter.call(this);
    BoxComponent.call(this);

    /**
     * id of the Box
     * @private
     * @type {Object}
     */
    this._id = Box.generateUniqueBoxId();

    /**
     * Optional custom name  for the box. Use the setter if you wish to use one.
     * @type {null}
     * @private
     */
    this._name = null;

    /**
     * @private
     * @type {Object}
     */
    this._children = {};

    /**
     * property for boxxer.view.View instance to serialize
     * @type {boxxer.view.ViewContainer|undefined}
     */
    this.view = undefined;

    /**
     * width of the Box
     * @type {b.render.Dimension}
     */
    this.width = new Dimension(width);

    /**
     * height of the Box
     * @type {b.render.Dimension}
     */
    this.height = new Dimension(height);

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

mix(Box, Adjustable);
mix(Box, ElementWrapper);
mix(Box, ParentElementWrapper);

mix(Box, Layout);
mix(Box, Serializer);
mix(Box, EventEmitter);
mix(Box, BoxComponent);

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
    BoxComponent.flowChange(this);
    return this;
};

/**
 * creates a new Dimension for width property
 * @param value {string|Number}
 */
Box.prototype.setWidthDimension = function (value) {
    this.width = new Dimension(value);
    return this;
};

/**
 * creates a new Dimension for width property
 * @param value {string|Number}
 */
Box.prototype.setHeightDimension = function (value) {
    this.height = new Dimension(value);
    return this;
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
    this.addBox(box, name);
    return this;
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

    return this;
};

/**
 * Get the box custom name. Returns null if name was set.
 * @returns {null|String}
 */
Box.prototype.getName = function() {
    return this._name;
};

/**
 * Set a custom name for the Box and register it.
 * @param name {String}
 */
Box.prototype.setName = function(name) {
    if (Box._nameRegistry[name]) {
        throw "Box name already exists: " + name;
    }

    this._name = name;

    Box._nameRegistry[name] = this.getId();

    return this;
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
    return this;
};

/**
 * Render the box and its children to the document
 */
Box.prototype.render = function () {
    var parent = this.getParentElement();
    var boxId = parent.getAttribute("data-box-id");
    var parentBox = Box.getById(boxId);
    var eventType = EventEmitter.ON_RENDER;
    var flowDirection;

    if (parentBox instanceof Box) {
        flowDirection = parentBox.getFlowDirection();
    }

    BoxRenderer.render(this, parent, flowDirection);
    BoxComponent.render(this);

    if (this.isRendered) {
        eventType = EventEmitter.ON_UPDATE;
    } else {
        this.isRendered = true;
    }

    this.emit(eventType);

    return this;
};

/**
 * destroys and removes the Box
 */
Box.prototype.destroy = function () {
    delete Box._nameRegistry[this.getName()];
    delete Box._registry[this.getId()];
    BoxComponent.destroy(this);
    removeElement(this.getElement());
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
 * @static
 * @type {Object}
 */
Box._nameRegistry = {};

/**
 * static counter for Box ids
 * @static
 * @private
 * @type {Number}
 */
Box.REG_PREFIX = "bbox_";

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
    return Box.REG_PREFIX + Box._id++;
};

/**
 * removes a Box from the registry
 * @param id {String} id of the Box to remove
 */
Box.removeBox = function (id) {
    delete Box._registry[id];
};

/**
 * returns a registered Box from the registry by id
 * @param id {String} the Box id
 * @return {Box}
 */
Box.getById = function (id) {
    return Box._registry[id];
};

/**
 * Returns a registered Box from the registry by name
 * @param name
 * @returns {*}
 */
Box.getByName = function(name) {
    var id = Box._nameRegistry[name];
    return id ? Box._registry[id] : null;
};

/**
 * cleans up the Box.s_oRegistry
 */
Box.clean = function () {
    Box._id = 0;
    Box._registry = {};
};

/**
 * @param setup {Object} map of settings
 *
 * Schema: {
 *         [width] {Number|String}
 *         [height] {Number|String}
 *         [parent] {HTMLElement}
 *         [flow] {String}
 *     }
 *
 * @return {Box}
 */
api.createBox = function createBox(setup) {
    var flow,
        box;

    setup = setup || {};

    flow = setup.flow;
    box = new Box(
        setup.width,
        setup.height,
        (setup.parent || setup.container)
    );

    return box.setFlowDirection(flow).setComponent(setup.component);
};
/**
 * @param setup {Object} map of settings
 *
 * Schema: {
 *         [width] {Number|String}
 *         [height] {Number|String}
 *         [left] {Number|String}
 *         [right] {Number|String}
 *     }
 *
 * @return {Dialog}
 */
api.createDialog = function createDialog(setup) {
    var dialog;

    setup = setup || {};

    dialog = new Dialog(
        setup.width,
        setup.height,
        setup.left,
        setup.right
    );

    return dialog;
};


}.call(this));