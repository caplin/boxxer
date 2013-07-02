exports.Decorator = Decorator;

/**
 * @constructor Decorator
 */
function Decorator() {}

/**
 * returns a predefined template
 * @param box {Box}
 * @returns {HTMLElement}
 */
Decorator.prototype.getTemplate = function () {
    var element = document.createElement(this.tagName || 'div');
    if (this.className) {
        element.className = this.className;
    }
    return element;
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
 * returns an instance of the requested decorator
 * @param decoratorName {String} The name reference for the decorator
 * @param box {Box} box instance to apply decorator too
 * @returns {Decorator}
 */
Decorator.get = function (decoratorName, box) {
    var decorator = Decorator.extend(Decorator.registry[decoratorName]);
    decorator.box = box;
    decorator.template = decorator.getTemplate();
    if (typeof decorator.initialize === 'function') {
        decorator.initialize();
    }
    return decorator;
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

    return decorator;
};

/**
 * creates and registers a new decorator
 * @param name {String} name of the Decorator
 * @param prototype {Object} map containing the applied functionality
 * @returns {Decorator|undefined}
 */
Decorator.register = function (name, prototype) {
    Decorator.registry[name] = prototype;
};

exports.createDecorator = Decorator.register;
