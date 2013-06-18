exports.ParentElementWrapper = ParentElementWrapper;

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
};
