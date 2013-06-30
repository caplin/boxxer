boxxer.createDecorator("Drag", {

    engage: function (box, template) {
        var element = box.getElement();
        element.setAttribute("draggable", true);
    }
});