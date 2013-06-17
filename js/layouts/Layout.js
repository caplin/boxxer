boxxer.register("layouts", "Layout", function (b) {

    function Layout() {

    }

    Layout.prototype.getLayout = function() {
        new b.async.Connection(Layout.URL + "/" + this.getId())
            .get();
    };

    Layout.prototype.saveLayout = function(name) {
        var layout = this.serialize(b.mixins.Serializer.JSON, name || null);
        new b.async.Connection(Layout.URL + "/" + this.getId(), {
            data: layout
        }).save();
    };

    Layout.prototype.deleteLayout = function() {
        new b.async.Connection(Layout.URL + this.getId())
            .remove();
    };

//    Layout.URL = "http://localhost:666/layout";
    Layout.URL = window.location.href;

    b.layouts.Layout = Layout;

    return Layout;
});