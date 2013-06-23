exports.Layout = Layout;

function Layout() {}

Layout.prototype.getLayoutPath = function() {
    return this.getName() || this.getId();
};

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

Layout.prototype.saveLayout = function(name) {
    var layout = this.serialize(Serializer.JSON, name || null);

    new Connection(Layout.URL + "/" + this.getLayoutPath(), {
        data: layout
    }).save();
};

Layout.prototype.deleteLayout = function() {
    new Connection(Layout.URL + this.getLayoutPath()).remove();
};

// Layout.URL = "http://localhost:666/layout";
Layout.URL = window.location.href + "/layout";
