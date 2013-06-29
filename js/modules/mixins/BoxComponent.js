exports.BoxComponent = BoxComponent;

/**
 * @name BoxComponent
 * Component adapter class to provide ComponentLifeCycleEvents for the Component inside the Box
 * @param component {Component|undefined}
 * @constructor BoxComponent
 */
function BoxComponent(component) {
    /**
     * @type {Component|undefined}
     */
    this.component = component;
}

/**
 * sets the component on the Box instance
 * @param component {Component}
 * @returns {Box}
 */
BoxComponent.prototype.setComponent = function (component) {

    if (component) {
        this.component = component;
    }

    return this;
};

/**
 * returns the Component
 * @returns {Component}
 */
BoxComponent.prototype.getComponent = function () {
    return this.component;
};

/**
 * invokes onOpen or onResize for the Component inside the Box
 * instance depending whether the Box has been rendered or not.
 * @param box {Box}
 * @returns {Box}
 */
BoxComponent.render = function (box) {

    var component = box.getComponent();
    var element;

    if (component) {
        element = box.getElement();
        BoxComponent.invoke(!box.isRendered ? "onOpen" : "onResize", box, [element.offsetWidth, element.offsetHeight]);
    }

    return this;
};

/**
 * Invokes a onEvent method on a component if it is present
 * @param methodName {String} Method name to invoke on the component
 * @param box {Box}
 * @param [args] {Array} Optional array of arguments to pass to the method being invoked
 */
BoxComponent.invoke = function(methodName, box, args) {
    var component = box.getComponent();

    if (component && component[methodName]) {
        component[methodName].apply(component, args || []);
    }

    return box;
};

/**
 * invokes onClose for the Component inside the Box instance
 * @param box {Box}
 * @returns {Box}
 */
BoxComponent.destroy = function (box) {
    BoxComponent.invoke("onClose", box, []);
};

/**
 * invokes onFlowChange for the Component inside the Box instance
 * @param box
 * @returns {*}
 */
BoxComponent.flowChange = function(box) {
    BoxComponent.invoke("onFlowChange", box, []);
};

/**
 * invokes onMaximize for the Component inside the Box instance
 * @param box
 * @returns {*}
 */
BoxComponent.maximize = function(box) {
    BoxComponent.invoke("onMaximize", box, []);
};

/**
 * invokes onMinimize for the Component inside the Box instance
 * @param box
 * @returns {*}
 */
BoxComponent.minimize = function(box) {
    BoxComponent.invoke("onMinimize", box, []);
};

/**
 * invokes onRestore for the Component inside the Box instance
 * @param box
 * @returns {*}
 */
BoxComponent.restore = function(box) {
    BoxComponent.invoke("onRestore", box, []);
};
