boxxer.createDecorator("MinimizeButton", {

    initialize: function () {
        var element = this.box.getElement();

        // TODO this need to be a custom option
        this.box.width.setMinimumValue(this.box.width.getValue());
        this.box.height.setMinimumValue("40px");

        element.style.position = "relative";
        element.appendChild(this.template.getElement());
    },

    getTemplate: function () {

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
        })(this.box, button));

        return button;
    }
});