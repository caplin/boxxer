exports.EventEmitter = EventEmitter;

/**
 * EventEmitter instances are able to register and emit events
 * @constructor EventEmitter
 */
function EventEmitter() {
    /**
     * map to store event types and Events by their ids
     * @private
     * @type {Object}
     */
    this._eventTypes = {};

    /**
     * map to store muted event types as keys
     * @private
     * @type {Object}
     */
    this._mutedTypes = {};
}

/**
 * @private
 * registers an event type
 * @param eventType {String}
 * @return {Object}
 */
EventEmitter.prototype._createEventType = function (eventType) {
    if (!this._eventTypes.hasOwnProperty(eventType)) {
        this._eventTypes[eventType] = {};
    }

    return this._eventTypes[eventType];
};

/**
 * registers an Event
 * @param eventType {String} event type
 * @param callback {Function} callback method
 * @param context {Object} custom context
 * @return {BoxEvent}
 */
EventEmitter.prototype.on = function (eventType, callback, context) {
    var event = new BoxEvent(eventType, callback, (context || this));

    this._createEventType(eventType)[event.getId()] = event;

    return event;
};

/**
 * un-registers the Event
 * @param event {BoxEvent} Event instance
 */
EventEmitter.prototype.off = function (event) {
    if (!(event instanceof BoxEvent)) {
        throw new TypeError("Cannot un-register a non-Event type object...");
    }

    delete this._eventTypes[event.getEventType()][event.getId()];
};

/**
 * mutes an event type
 * @param eventType {String} event type
 */
EventEmitter.prototype.mute = function (eventType) {
    this._mutedTypes[eventType] = true;
};

/**
 * mutes an event type
 * @param eventType {String} event type
 */
EventEmitter.prototype.unmute = function (eventType) {
    delete this._mutedTypes[eventType];
};

/**
 * determines whether an event type is muted or not
 * @param eventType {String} event type
 */
EventEmitter.prototype.isMuted = function (eventType) {
    return this._mutedTypes.hasOwnProperty(eventType);
};

/**
 * executes all registered Events for an even type
 */
EventEmitter.prototype.emit = function () {
    var args = Array.prototype.slice.call(arguments),
        eventType = args.shift(),
        eventTypes = this._eventTypes[eventType],
        event,
        id;

    if (!this.isMuted(eventType)) {
        for (id in eventTypes) {
            if (eventTypes.hasOwnProperty(id)) {
                event = eventTypes[id];
                event.execute.apply(event, args);
            }
        }
    }
};

/**
 * @static
 * @type {String}
 */
EventEmitter.ON_RENDER = "render";

/**
 * @static
 * @type {String}
 */
EventEmitter.ON_UPDATE = "update";
