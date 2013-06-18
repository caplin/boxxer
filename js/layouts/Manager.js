boxxer.register("layouts", "Manager", function (b) {

    function Manager() {
    }

    Manager.prototype.getLayouts = function(callback) {
        new b.async.Connection(Layout.URL + "/" + this.getId(), {
            data: layout
        }).save();
    };

    Manager.url = "/layouts";

    return Manager;
});