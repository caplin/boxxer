exports.Dimension = Dimension;

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
