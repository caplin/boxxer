boxxer.createDecorator("BoxHeader", {

    //engages custom template for Box
    engage: function (box, template) {
        var element = box.getElement();
        element.style.position = "relative";
        element.appendChild(template.getElement());
        box.height.setMinimumValue(template.getElement().style.height);
    },

    //returns custom template
    getTemplate: function (box) {

        var header = new ElementWrapper(document.createElement("h5"));

        header
            .html(box.getName() || box.getId())
            .addClass("boxHeader");

        return header;
    }
});