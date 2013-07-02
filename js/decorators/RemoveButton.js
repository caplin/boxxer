boxxer.createDecorator("RemoveButton", {

    initialize: function () {
        var element = this.box.getElement();
        element.style.position = "relative";
        element.appendChild(this.template.getElement());
    },

    getTemplate: function () {

        var button = new ElementWrapper(document.createElement("button"));

        button
            .html("x")
            // TODO handle this via CSS using the class
            .css({
                position: "absolute",
                right: "5px",
                top: "5px"
            })
            .addClass("remove");

        new DOMEvent(button.getElement()).on("click", this.box.destroy.bind(this.box));

        return button;
    }
});