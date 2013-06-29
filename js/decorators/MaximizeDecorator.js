boxxer.createDecorator("MaximizeDecorator", {

    //engages custom template for Box
    engage: function (box, template) {
        var element = box.getElement();
        element.style.position = "relative";
        element.appendChild(template);
    },

    //returns custom template
    getTemplate: function (box) {
        var button = document.createElement("button");

        button.innerHTML = "+";
        button.style.position = "absolute";
        button.style.right = "10px";
        button.style.top = "10px";

        button.onclick =(function(box){
            return function() {
                if (button.innerHTML === "+") {
                    box.maximize();
                    button.innerHTML = "~";
                } else {
                    box.restore();
                    button.innerHTML = "+";
                }
            }
        })(box);

        return button;
    }
});