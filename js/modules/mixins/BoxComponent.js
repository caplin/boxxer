exports.BoxComponent = BoxComponent;

/**
 * Component adapter class to provide ComponentLifeCycleEvents for the Component inside the Box
 * @param component {caplin.component.Component|undefined}
 * @constructor BoxComponent
 */
function BoxComponent(component) {
    /**
     * @type {caplin.component.Component|undefined}
     */
    this.component = component;
}

/**
 * sets the component on the Box instance
 * @param component {caplin.component.Component}
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
 * @returns {caplin.component.Component}
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

        //trigger open if not rendered
        if (!box.isRendered) {
            component.onOpen(element.offsetWidth, element.offsetHeight);
        } else {
            //trigger resize
            component.onResize(element.offsetWidth, element.offsetHeight);
        }
    }

    return this;
};

/**
 * invokes onClose for the Component inside the Box instance
 * @param box {Box}
 * @returns {Box}
 */
BoxComponent.destroy = function (box) {
    var component = box.getComponent();

    if (component) {
        component.onClose();
    }

    return box;
};
