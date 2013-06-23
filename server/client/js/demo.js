var tiles = [];
var frame = new boxxer.Box("foo");
frame.setName("myLayout");
//frame.getLayout();

var header = new boxxer.Box();
var tileSet = new boxxer.Box(50, 50);
var blotter = new boxxer.Box(20, 20);

tileSet.setFlowDirection(boxxer.Box.FLOW_HORIZONTAL);

header.addClass("header");
tileSet.addClass("tileSet");
blotter.addClass("blotter");

for (var i = 0; i < 10; i++) {
    var box = new boxxer.Box("200px", "200px");
    new Tile(box);
    tileSet.addBox(box);
    tiles.push(box);
}

frame.addBox(header);
frame.addBox(tileSet);
frame.addBox(blotter);
//frame.saveLayout();

window.onload = function () {
    frame.render();
    window.onresize = function () {
        frame.render();
    };
};