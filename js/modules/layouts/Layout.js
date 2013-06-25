exports.Layout = Layout;

/**
 * Abstract class that extend box instance and provide layout persistence
 * @constructor Layout
 */
function Layout() {}

/**
 * Return the path for the layout
 * @returns {*}
 */
Layout.prototype.getLayoutPath = function() {
    return this.getName() || this.getId();
};

/**
 * Retrieve a layout from the back-end
 */
Layout.prototype.getLayout = function() {
    var callback = function(rawData) {
        var data = JSON.parse(rawData.responseText);
        var layout = data.layout;
        var box = Serializer.deserialize(layout);

        this.addBox(box);
    }.bind(this);

    new Connection(Layout.URL + "/" + this.getLayoutPath(), {
        callback: callback
    }).get();
};

/**
 * Save a layout in the back-end
 * @param name
 */
Layout.prototype.saveLayout = function(name) {
    var layout = this.serialize(Serializer.JSON, name || null);

    new Connection(Layout.URL + "/" + this.getLayoutPath(), {
        data: layout
    }).save();
};

/**
 * Delete a layout from the back-end
 */
Layout.prototype.deleteLayout = function() {
    new Connection(Layout.URL + this.getLayoutPath()).remove();
};

/**
 * Path to the layouts API
 * @type {string}
 */
Layout.URL = window.location.href + "/layout";
