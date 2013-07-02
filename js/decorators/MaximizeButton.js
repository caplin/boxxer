boxxer.createDecorator("MaximizeButton", {

    initialize: function () {
        var element = this.box.getElement();
        element.style.position = "relative";
        element.appendChild(this.template.getElement());
    },

    getTemplate: function () {

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
        })(this.box, button));

        return button;
    }
});