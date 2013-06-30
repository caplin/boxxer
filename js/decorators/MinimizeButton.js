boxxer.createDecorator("MinimizeButton", {

    engage: function (box, template) {
        var element = box.getElement();

        // TODO this need to be a custom option
        box.width.setMinimumValue(box.width.getValue());
        box.height.setMinimumValue("40px");

        element.style.position = "relative";
        element.appendChild(template.getElement());
    },

    getTemplate: function (box) {

        var button = new ElementWrapper(document.createElement("button"));

        button
            .html("-")
            // TODO handle this via CSS using the class
            .css({
                position: "absolute",
                right: "50px",
                top: "5px"
            })
            .addClass("minimize");

        new DOMEvent(button.getElement()).on("click", (function(box, button){
            return function() {
                if (button.html() === "-") {
                    box.minimize();
                    button.html("~");
                } else {
                    box.restore();
                    button.html("-");
                }
            }
        })(box, button));

        return button;
    }
});