exports.Dialog = Dialog;

/**
 * @param [view] {ViewContainer}
 * @param [callback] {Function}
 * @param [context] {Object}
 * @constructor Dialog
 */
function Dialog(view, callback, context) {
    var element = document.createElement("div");
    element.style.position = "absolute";

    this.element = element;
    this.view = view;
    this.width = 0;
    this.height = 0;
    this.openContext = context || this;
    this.openCallback = callback;
}

/**
 * opens the Dialog
 * @param [view] {ViewContainer}
 * @param [width] {Number}
 * @param [height] {Number}
 */
Dialog.prototype.open = function (view, width, height) {
    var element = this.element;
    var viewContent = (view || this.view).render(element);
    var tempElement;

    element.style.width = (this.width || width) + "px";
    element.style.height = (this.height || height) + "px";

    if (typeof this.openCallback === "function") {
        this.openCallback.call(this.openContext || this, this);
    }

    if (viewContent) {
        if (viewContent instanceof Node) {
            element.appendChild(viewContent);
        } else if (typeof viewContent === "string") {
            tempElement = document.createElement("div");
            tempElement.innerHTML = viewContent;
            //append content wrapper firstChildElement
            element.appendChild(tempElement.firstElementChild);
        }
    }
};
