boxxer.createDecorator("HeaderDecorator", {
    //engages custom template for Box
    engage: function (box, template) {
        var element = box.getElement();
        element.style.position = "relative";
        element.appendChild(template);
    },
    //returns custom template
    getTemplate: function (box) {
        var h5 = document.createElement("h5"),
            header = document.createElement("div");

        header.setAttribute("class", "HeaderDecorator");
        header.innerHTML = box.getId();
        header.style.position = "absolute";
        header.style.left = "0px";
        header.style.top = "0px";

        return header;
    }
});