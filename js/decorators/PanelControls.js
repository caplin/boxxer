boxxer.createDecorator("PanelControls", {

    events: {
        click: {
            ".panel-minimize": "onMinimize",
            ".panel-maximize": "onMaximize",
            ".panel-close": "onClose"
        }
    },

    initialize: function () {
        this.box.css({position:"relative"});
        this.box.append(this.template.getElement());

        this.box.width.setMinimumValue(this.box.width.getValue());
        this.box.height.setMinimumValue(this.template.getElementHeight());

        this.minimized = false;
        this.maximized = false;
    },

    reset: function(property) {
        this[property] = false;
        this.box.restore();
    },

    onMinimize: function() {
        this.minimized = !this.minimized;
        if (this.minimized) {
            this.reset("maximized");
            this.box.minimize();
        } else {
            this.box.restore();
        }
    },

    onMaximize: function() {
        this.maximized = !this.maximized;
        if (this.maximized) {
            this.reset("minimized");
            this.box.maximize();
        } else {
            this.box.restore();
        }
    },

    onClose: function() {
        this.box.destroy();
    },

    getTemplate: function () {
        return new ElementWrapper(document.createElement("div"))
            .addClass("panel-controls")
            .html(
                '<div class="panel-title">Tile</div>' +
                '<div class="panel-buttons">' +
                    '<button class="panel-minimize">-</button>' +
                    '<button class="panel-maximize">+</button>' +
                    '<button class="panel-close">x</button>' +
                '</div>'
            );
    }
});