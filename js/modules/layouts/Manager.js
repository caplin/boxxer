exports.Manager = Manager;

function Manager() {}

/**
 * fetches the specified layout from the server via the REST API
 */
Manager.prototype.getLayouts = function() {
    new Connection(Layout.URL + "/" + this.getId(), {
        data: layout
    }).save();
};

/**
 * @static
 * @constant
 * @type {string}
 */
Manager.URL = "/layouts";
