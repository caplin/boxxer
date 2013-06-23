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
