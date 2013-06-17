boxxer.register("async", "Async", function (b) {

    /**
     * @constructor provides save mixin method for Box instances for asynchronous state saving
     */
    function Async() {}

    /**
     * method gets merged to the implementor class
     * @returns {*}
     */
    Async.prototype.save = function (url, callback, format, method) {
        return Async.saveBox(this, url, method, callback, format);
    };

    /**
     * serializes and saves the given Box instance
     * @param box {boxxer.Box}
     * @param url {String}
     * @param [method] {String} GET/POST
     * @param [callback] {Function}
     * @param [format] {String}
     */
    Async.saveBox = function (box, url, method, callback, format) {
        if (!format) {
            format = b.mixins.Serializer.JSON;
        }

        new b.async.Connection(box, url, method, format, callback)
            .save();
    };

    /**
     * PUT request
     * @type {string}
     */
    Async.POST = "PUT";

    /**
     * DELETE request
     * @type {string}
     */
    Async.POST = "DELETE";

    /**
     * POST request
     * @type {string}
     */
    Async.POST = "POST";

    /**
     * GET request
     * @type {string}
     */
    Async.GET = "GET";

    //temporary exposition of namespace for WebStorm/IntelliJ object member visibility support
    b.async.Async = Async;

    return Async;
});