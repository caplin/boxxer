boxxer.createDecorator("RemoveButton", {

    engage: function (box, template) {
        var element = box.getElement();
        element.style.position = "relative";
        element.appendChild(template.getElement());
    },

    getTemplate: function (box) {

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

        new DOMEvent(button.getElement()).on("click", box.destroy.bind(box));

        return button;
    }
});