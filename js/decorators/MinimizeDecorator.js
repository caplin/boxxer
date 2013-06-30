boxxer.createDecorator("MinimizeDecorator", {

    //engages custom template for Box
    engage: function (box, template) {
        var element = box.getElement();
        element.style.position = "relative";
        element.appendChild(template);
    },

    //returns custom template
    getTemplate: function (box) {
        var button = document.createElement("button");

        button.setAttribute("class", "MinimizeDecorator");
        button.innerHTML = "-";
        button.style.position = "absolute";
        button.style.right = "32px";
        button.style.top = "5px";

        button.onclick =(function(box){
            return function() {
                if (button.innerHTML === "-") {
                    box.minimize();
                    button.innerHTML = "~";
                } else {
                    box.restore();
                    button.innerHTML = "-";
                }
            }
        })(box);

        return button;
    }
});