boxxer.register("events", "BoxEvent", function (b) {
    /**
     * BoxEvent subscription class
     * @param eventType {String} the event type which the event is subscribed
     * @param fallback {Function} callback to execute
     * @param context {Object} custom context
     * @constructor BoxEvent
     */
    function BoxEvent(eventType, fallback, context) {
        this._eventType = eventType;
        this._callback = fallback;
        this._context = context;
        this._muted = false;
        this._id = ('event_' + BoxEvent._id++);
    }

    /**
     * executes the Event instance if the object s not muted
     */
    BoxEvent.prototype.execute = function () {
        if (!this.isMuted()) {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(this.getEventType());

            this._callback.apply(this._context, args);
        }
    };

    /**
     * returns the id of the Event
     * @return {Number}
     */
    BoxEvent.prototype.getId = function () {
        return this._id;
    };

    /**
     * returns the type which the event is registered to
     * @return {String}
     */
    BoxEvent.prototype.getEventType = function () {
        return this._eventType;
    };

    /**
     * mutes the Event - does not let the Event to execute
     */
    BoxEvent.prototype.mute = function () {
        this._muted = true;
    };

    /**
     * unmutes the Event
     */
    BoxEvent.prototype.unmute = function () {
        this._muted = false;
    };

    /**
     * determines whether the Event is muted or not
     * @return {Boolean}
     */
    BoxEvent.prototype.isMuted = function () {
        return this._muted;
    };

    /**
     * @private
     * @static
     * @type {Number}
     */
    BoxEvent._id = 0;

    //temporary exposition of namespace for WebStorm/IntelliJ object member visibility support
    b.events.BoxEvent = BoxEvent;

    return BoxEvent;
});