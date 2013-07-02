boxxer.createDecorator("BoxHeader", {

    //engages custom template for Box
    initialize: function () {
        this.box.css({position:"relative"});
        this.box.append(this.template.getElement());
        this.box.height.setMinimumValue(this.template.getElement().style.height);
    },

    //returns custom template
    getTemplate: function () {

        var header = new ElementWrapper(document.createElement("h5"));

        header
            .html(this.box.getName() || this.box.getId())
            .addClass("boxHeader");

        return header;
    }
});