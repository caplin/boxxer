exports.ElementWrapper = ElementWrapper;

/**
 * @name ElementWrapper
 * @constructor
 * @param [element] {HTMLElement} Optional so that the class can be used by others
 */
function ElementWrapper(element) {
    /**
     * the HTMLElement of the Box instance - DOM
     * @private
     * @type {HTMLDivElement}
     */
    this._element = element || document.createElement("div");
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
 * Set multiple properties on an element
 * @param properties
 */
ElementWrapper.prototype.css = function(properties) {

    var element = this.getElement();
    var prop;

    for (prop in properties) {
        element.style[prop] = properties[prop];
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
ElementWrapper.prototype.maximize = function () {
    this.css({
        position: "absolute",
        left: "0",
        top: "0",
        zIndex: Box.getZIndex()
    });
    this.setElementDimension(document.width, document.height);
    BoxComponent.maximize(this);
    this.emit(EventEmitter.ON_MAXIMIZE);
    return this;
};

/**
 * Minimize the visual representation of the Box instance
 */
ElementWrapper.prototype.minimize = function () {
    this.setElementDimension(this.width.getMinimumValue(), this.height.getMinimumValue());
    BoxComponent.minimize(this);
    this.emit(EventEmitter.ON_MINIMIZE);
    return this;
};

/**
 * Restore the visual representation of the Box instance to its original configuration
 */
ElementWrapper.prototype.restore = function () {
    this.css({
        position: "relative",
        left: "auto",
        top: "auto",
        zIndex: "auto"
    });
    this.setElementDimension(this.width.getValue(), this.height.getValue());
    BoxComponent.restore(this);
    this.emit(EventEmitter.ON_RESTORE);
    return this;
};
