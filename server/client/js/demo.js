//var tiles = [];
var frame = new boxxer.Box("foo");
frame.getLayout();

//var header = new boxxer.Box();
//var tileSet = new boxxer.Box(5, 5);
//var blotter = new boxxer.Box(2, 2);
//
//tileSet.setFlowDirection(boxxer.Box.FLOW_HORIZONTAL);
//
//header.addClass("header");
//tileSet.addClass("tileSet");
//blotter.addClass("blotter");
//
//for (var i = 0; i < 10; i++) {
//    var box = new boxxer.Box("200px", "200px");
//    new Tile(box);
//    tileSet.addBox(box);
//    tiles.push(box);
//}
//
//frame.addBox(header);
//frame.addBox(tileSet);
//frame.addBox(blotter);
//frame.saveLayout();

window.onload = function () {
    frame.render();
    window.onresize = function () {
        frame.render();
    };
};