exports.ViewContainer = ViewContainer;

/**
 * abstract class to maintain custom user views inside Box and Panel instances
 * @constructor ViewContainer
 */
function ViewContainer(box) {
    this.box = box;
}

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