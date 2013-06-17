/*global boxxer */
window.onload = function () {
    boxxer.init();

    var Box = boxxer.Box;
    Box.MIN_DIMENSION = 1;

	var parentBox = new Box(),
        childCount = 6,
        split = Math.round(childCount / 2);

	parentBox.setFlowDirection(Box.FLOW_HORIZONTAL);

    parentBox
        .addDecorator("HeaderDecorator")
        .addDecorator("DragDecorator")
        .addDecorator("DropDecorator");

    for (var i = 0; i < childCount; i++) {
        if (i < split) {
            parentBox.addBox(new Box((!i ? 1 : (i + 1)), 2));
        } else {
            parentBox.addBox(new Box("150px", "100px"));
        }
    }

    var container = parentBox.addBox(new Box("500px", "200px"), "hakunamatata");

    container.setFlowDirection(Box.FLOW_HORIZONTAL);

    container.addBox(new Box("100px", "100px"));
    container.addBox(new Box());

    parentBox.render();

    parentBox.saveLayout();

    window.onresize = function () {
        parentBox.render();
    };
};