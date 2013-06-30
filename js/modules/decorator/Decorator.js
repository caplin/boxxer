exports.Decorator = Decorator;

/**
 * @constructor Decorator
 */
function Decorator() {}

/**
 * method needs to be overwritten!
 *
 * applies (engages) the decorator when the Box has been rendered
 *
 * @param box {boxxer.Box}
 * @param template {HTMLElement}
 * @returns {Decorator}
 */
Decorator.prototype.engage = function (box, template) {
    return this;
};

/**
 * returns a predefined template
 * @param box {boxxer.Box}
 * @returns {HTMLElement}
 */
Decorator.prototype.getTemplate = function (box) {
    return document.createElement("div");
};

/**
 * registry for every decorator
 * @static
 * @type {{}}
 */
Decorator.registry = {};

/**
 * determines whether a decorator has already been registered
 * @param decoratorName {String} name of the decorator
 * @returns {Boolean}
 */
Decorator.isRegistered = function (decoratorName) {
    return Decorator.registry.hasOwnProperty(decoratorName);
};

/**
 * returns the required decorator
 * @param decoratorName {String}
 * @returns {Decorator}
 */
Decorator.getDecorator = function (decoratorName) {
    return Decorator.registry[decoratorName];
};

/**
 * creates a new decorator instance to decorate
 * @param prototype
 * @returns {Decorator}
 */
Decorator.extend = function (prototype) {
    var decorator = new Decorator();
    var property;

    for (property in prototype) {
        if (prototype.hasOwnProperty(property)) {
            decorator[property] = prototype[property];
        }
    }

    //initialize decorator once
    if (typeof decorator.init === "function") {
        decorator.init();
    }
console.log(decorator);
    return decorator;
};

/**
 * creates and registers a new decorator
 * @param name {String} name of the Decorator
 * @param prototype {Object} map containing the applied functionality
 * @returns {Decorator|undefined}
 */
Decorator.register = function (name, prototype) {
    var registry = Decorator.registry;
    var decorator;

    if (name !== '' && !registry.hasOwnProperty(name)) {
        decorator = Decorator.extend(prototype);
        registry[name] = decorator;
    }

    return decorator;
};

exports.createDecorator = Decorator.register;
