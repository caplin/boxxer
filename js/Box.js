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

    return this;
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
    this._flowDirection = (flowDirection || Box.FLOW_VERTICAL);
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
Box.MIN_DIMENSION = "10px";

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
