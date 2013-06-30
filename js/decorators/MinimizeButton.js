boxxer.createDecorator("MinimizeButton", {

    //engages custom template for Box
    engage: function (box, template) {
        var element = box.getElement();
        console.log(box);
        box.width.setMinimumValue(box.width.getValue());
        box.height.setMinimumValue("40px");
        element.style.position = "relative";
        element.appendChild(template.getElement());
    },

    //returns custom template
    getTemplate: function (box) {

        var button = new ElementWrapper(document.createElement("button"));

        button
            .html("-")
            .css({
                position: "absolute",
                right: "32px",
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