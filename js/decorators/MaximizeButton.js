boxxer.createDecorator("MaximizeButton", {

    engage: function (box, template) {
        var element = box.getElement();
        element.style.position = "relative";
        element.appendChild(template.getElement());
    },

    getTemplate: function (box) {

        var button = new ElementWrapper(document.createElement("button"));

        button
            .html("+")
            // TODO handle this via CSS using the class
            .css({
                position: "absolute",
                right: "27px",
                top: "5px"
            })
            .addClass("maximize");

        new DOMEvent(button.getElement()).on("click", (function(box, button){
            return function() {
                if (button.html() === "+") {
                    box.maximize();
                    button.html("~");
                } else {
                    box.restore();
                    button.html("+");
                }
            }
        })(box, button));

        return button;
    }
});