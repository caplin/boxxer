exports.DOMEvent = DOMEvent;

/**
 * class to simplify DOm event binding
 * @param element {HTMLElement}
 * @constructor
 */
function DOMEvent(element) {
    this._element = element;
    this._callback = {};
    return this;
}

/**
 * Bind an event
 * @param eventType
 * @param callback
 */
DOMEvent.prototype.on = function(eventType, callback) {
    this._callback[eventType] = callback;
    this._eventType = eventType;
    DOMEvent.addListener(this._element, this._eventType, this._callback[eventType]);
    return this;
};

/**
 * Unbind an event
 * @param eventType
 * @returns {*}
 */
DOMEvent.prototype.off = function(eventType) {
    if (this._callback) {
        DOMEvent.removeListener(this._element, this._eventType, this._callback[eventType]);
    }
    return this;
};

DOMEvent._div = document.createElement('div');

/**
 * static bind event method
 * @param element
 * @param eventType
 * @param callback
 */
DOMEvent.addListener = function(element, eventType, callback) {
    element.addEventListener(eventType, callback, false);
};

/**
 * static unbind event method
 * @param element
 * @param eventType
 * @param callback
 */
DOMEvent.removeListener = function(element, eventType, callback) {
    element.removeEventListener(eventType, callback, false);
};