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
