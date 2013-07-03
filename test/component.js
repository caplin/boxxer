// Tile component
var Tile = function() {
    this._element = document.createElement("div");
};

// implements Component and LifeCycle interfaces
boxxer.mix(Tile, boxxer.Component);
boxxer.mix(Tile, boxxer.LifeCycle);

// throw an error if not implemented
Tile.prototype.getElement = function() {
    return this._element;
};

Tile.prototype.onOpen = function(box) {
//        console.log("tile", box.getId());
};

Tile.prototype.onRestore = function(box) {
    console.log("tile restored", box.getId());
};

Tile.prototype.onMaximize = function(box) {
    console.log("tile maximized", box.getId());
};

Tile.prototype.onMinimize = function(box) {
    console.log("tile minimized", box.getId());
};

// create our layout
var frame = boxxer.createBox({height:"40px"});

var header = boxxer.createBox()
    .addDecorator("Drop")
    .addClass("top");

var tileSet = boxxer.createBox({height:10, flow:boxxer.Box.FLOW_HORIZONTAL})
    .addDecorator("Drop")
    .addClass("tileSet");

var blotter = boxxer.createBox({height:7})
    .addDecorator("Drop")
    .addClass("blotter");

// create a bunch of tiles
for (var i = 0; i < 10; i++) {

    tileSet.addBox(boxxer.createBox({
        name: "tile " + i,
        width: "200px",
        height: "200px",
        className: "tile",
        component: new Tile(),
        decorators: [
            "PanelControls",
            "Drag"
        ]
    }));
}

// add the lot to the frame
frame.addBox(header).addBox(tileSet).addBox(blotter);

// render the frame
frame.render(true);