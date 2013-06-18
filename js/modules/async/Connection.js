exports.Connection = Connection;

/**
 * @description Connection class is responsible to handle all asynchronous Box persistence
 * @param url {String}
 * @param params {Object}
 * @constructor Connection
 */
function Connection(url, params) {
    this._url = url;
    this._data = params.data || "";
    this._callback = params.callback;
    this._request = new XMLHttpRequest(); //IE7+
}

/**
 * method will be invoked on each state change on the request object
 */
Connection.prototype.onStateChange = function () {
    var request = this._request;
    var args;

    if (typeof this._callback === "function") {
        if (request.readyState === 4 && request.status === 200) {
            args = Array.prototype.slice(arguments);
            args.unshift(request, request.responseText);

            this._callback.apply(null, args);
        }
    }
};

/**
 * Send a "POST" request
 */
Connection.prototype.save = function() {
    this._request.onreadystatechange = this.onStateChange.bind(this);
    this._request.open(Connection.POST, this._url, true);
    this._request.send(this._data);
};
/**
 * Send a "PUT" request
 */
Connection.prototype.create = function() {
    this._request.onreadystatechange = this.onStateChange.bind(this);
    this._request.open(Connection.PUT, this._url, true);
    this._request.send(this._data);
};

/**
 * Send a DELETE request
 */
Connection.prototype.remove = function(){
    this._request.onreadystatechange = this.onStateChange.bind(this);
    this._request.open(Connection.DELETE, this._url, true);
    this._request.send();
};

/**
 * Send a GET request
 */
Connection.prototype.get = function(){
    this._request.onreadystatechange = this.onStateChange.bind(this);
    this._request.open(Connection.GET, this._url, true);
    this._request.send();
};

/**
 * PUT request
 * @type {string}
 */
Connection.PUT = "PUT";

/**
 * DELETE request
 * @type {string}
 */
Connection.DELETE = "DELETE";

/**
 * POST request
 * @type {string}
 */
Connection.POST = "POST";

/**
 * GET request
 * @type {string}
 */
Connection.GET = "GET";
