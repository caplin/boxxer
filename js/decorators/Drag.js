boxxer.createDecorator("Drag", {

    initialize: function (box) {

        var element = this.box.getElement();
        element.setAttribute("draggable", true);

        new DOMEvent(element)
            .on("dragstart", this.onDragStart.bind(this))
            .on("dragend", this.onDragEnd.bind(this));
    },

    onDragStart: function() {
        Box.dragTarget = this.box;
    },

    onDragEnd: function(event) {

        event.preventDefault();

        if (Box.dropTarget && Box.dragTarget) {

            Box.dropTarget.getElement().appendChild(Box.dragTarget.getElement());

            Box.moveBox(Box.dragTarget, Box.getById(Box.dragTarget.getParentElement().getAttribute("data-box-id")), Box.dropTarget);

            Box.dropTarget = undefined;
            Box.dragTarget = undefined;
        }
    }
});