boxxer.register("", "Box", function (b) {
    var regPrefix = "bbox_";
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