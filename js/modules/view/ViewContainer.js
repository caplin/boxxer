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
 * serializes the ViewContainer
 * @returns {string}
 */
ViewContainer.prototype.serialize = function () {
    return '\"\"';
};