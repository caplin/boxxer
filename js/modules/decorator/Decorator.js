exports.Decorator = Decorator;

/**
 * @constructor Decorator
 */
function Decorator() {}

/**
 * returns a predefined template
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

    if (decorator.events) {
        Decorator.setupEvents(decorator);
    }

    if (typeof decorator.initialize === 'function') {
        decorator.initialize();
    }
    return decorator;
};

/**
 * Handle events binding on decorators using the events property map
 * @param decorator {Decorator}
 */
Decorator.setupEvents = function(decorator) {
    var events = decorator.events;
    var template = decorator.template;
    var event;

    for(event in events) {
        new DOMEvent(template.getElement()).on(event, function(domEvent) {
            Decorator.handleEvent(domEvent, decorator);
        });
    }
};

/**
 * Handle event fired in a decorator and trigger methods based on the events map
 * @param domEvent {DOMEvent}
 * @param decorator {Decorator}
 */
Decorator.handleEvent = function(domEvent, decorator) {

    var queries = decorator.events[domEvent.type];
    var target = new ElementWrapper(domEvent.target);
    var query;

    for (query in queries) {
        // TODO we want to support all queries ideally not just single class or id
        // Probably need to build a map of target in setup for faster processing when events are fired
        if (target.hasClass(query.substring(1, query.length)) || target.id === query.substring(1, query.length)) {
            decorator[queries[query]].apply(decorator, [domEvent]);
        }
    }

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
