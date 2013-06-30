boxxer.createDecorator("Drag", {

    engage: function (box) {

        var element = box.getElement();
        element.setAttribute("draggable", true);

        this._box = box;

        new DOMEvent(element)
            .on("dragstart", this.onDragStart.bind(this))
            .on("dragend", this.onDragEnd.bind(this));
    },

    onDragStart: function() {
        Box.dragTarget = this._box;
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