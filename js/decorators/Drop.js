boxxer.createDecorator("Drop", {

    initialize: function () {

        new DOMEvent(this.box.getElement())
            .on("dragenter", this.onDragEnter.bind(this))
            .on("dragleave", this.onDragLeave.bind(this));
    },

    onDragEnter : function() {
        Box.dropTarget = this.box;
    },

    onDragLeave : function() {

    }
});