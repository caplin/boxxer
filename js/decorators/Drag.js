boxxer.createDecorator("Drag", {

    engage: function (box) {

        var element = box.getElement();
        element.setAttribute("draggable", true);

        this._box = box;

        new DOMEvent(element)
            .on("dragstart", this.onDragStart.bind(this))
            .on("dragend", this.onDragEnd.bind(this));
    },

    onDragStart: function(event) {
        Box.dragTarget = this._box;
        Box._dragTarget = Box.dragTarget.getElement();
    },

    onDragEnd: function(event) {
        event.preventDefault();
        if (Box._dropTarget && Box._dragTarget) {
            Box._dropTarget.appendChild(Box._dragTarget);

//            Box.dragTarget.moveTo(Box.dropTarget);

            Box._dropTarget = undefined;
            Box._dragTarget = undefined;
        }
    }
});