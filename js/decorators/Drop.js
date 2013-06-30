boxxer.createDecorator("Drop", {

    engage: function (box) {

        this._box = box;

        new DOMEvent(box.getElement())
            .on("dragenter", this.onDragEnter.bind(this))
            .on("dragleave", this.onDragLeave.bind(this));
    },

    onDragEnter : function() {
        Box.dropTarget = this._box;
        Box._dropTarget = Box.dropTarget.getElement();
    },

    onDragLeave : function() {

    }
});