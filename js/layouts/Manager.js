boxxer.register("layouts", "Manager", function (b) {

    function Manager() {
        this.url = "/layouts";
    }

    Manager.prototype.getLayouts = function() {
        // query back end
    };

    return Manager;
});