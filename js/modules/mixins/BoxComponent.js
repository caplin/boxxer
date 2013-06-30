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
        this.getElement().appendChild(component.getElement());
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
    return BoxComponent.invoke(!box.isRendered ? "onOpen" : "onResize", box);
};

/**
 * Invokes a onEvent method on a component if it is present
 * @param methodName {String} Method name to invoke on the component
 * @param box {Box}
 */
BoxComponent.invoke = function(methodName, box) {
    var component = box.getComponent();

    if (component && component[methodName]) {
        component[methodName].apply(component, [box]);
    }

    return box;
};

/**
 * invokes onClose for the Component inside the Box instance
 * @param box {Box}
 * @returns {Box}
 */
BoxComponent.destroy = function (box) {
    return BoxComponent.invoke("onClose", box);
};

/**
 * invokes onFlowChange for the Component inside the Box instance
 * @param box
 * @returns {*}
 */
BoxComponent.reflow = function(box) {
    return BoxComponent.invoke("onReflow", box);
};

/**
 * invokes onMaximize for the Component inside the Box instance
 * @param box
 * @returns {*}
 */
BoxComponent.maximize = function(box) {
    return BoxComponent.invoke("onMaximize", box);
};

/**
 * invokes onMinimize for the Component inside the Box instance
 * @param box
 * @returns {*}
 */
BoxComponent.minimize = function(box) {
    return BoxComponent.invoke("onMinimize", box);
};

/**
 * invokes onRestore for the Component inside the Box instance
 * @param box
 * @returns {*}
 */
BoxComponent.restore = function(box) {
    return BoxComponent.invoke("onRestore", box);
};

/**
 * invokes onRestore for the Component inside the Box instance
 * @param box
 * @returns {*}
 */
BoxComponent.show = function(box) {
    return BoxComponent.invoke("onShow", box);
};

/**
 * invokes onRestore for the Component inside the Box instance
 * @param box
 * @returns {*}
 */
BoxComponent.hide = function(box) {
    return BoxComponent.invoke("onHide", box);
};
