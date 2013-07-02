boxxer.createDecorator("RemoveButton", {

    initialize: function () {
        this.box.css({position:"relative"});
        this.box.append(this.template.getElement());
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