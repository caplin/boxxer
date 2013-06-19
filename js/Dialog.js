exports.Dialog = Dialog;

/**
 * @param [width] {Number|String}
 * @param [height] {Number|String}
 * @param [left] {Number|String}
 * @param [right] {Number|String}
 * @constructor Dialog
 */
function Dialog(width, height, left, right) {
    var element = document.createElement("div");
    element.style.position = "absolute";

    this.element = element;
    this.width = new Dimension(width);
    this.height = new Dimension(height);
    this.left = left || Dialog.CENTER;
    this.right = right || Dialog.CENTER;
    this.viewContainer = new ViewContainer(element);
}

/**
 * opens the Dialog
 * @return {Dialog}
 */
Dialog.prototype.open = function () {
    var body = getBody();
    var element = this.element;

    element.style.width = this.width.calculate(body.offsetWidth, 1);
    element.style.height = this.height.calculate(body.offsetHeight, 1);

    this.renderViewContent(element);

    body.appendChild(element);

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
    this.box.destroy();
    removeElement(this.getElement());
};

/**
 * @static
 * @type {String}
 */
Dialog.CENTER = "center";
