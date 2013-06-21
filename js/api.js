/**
 * @param setup {Object} map of settings
 *
 * Schema: {
 *         [width] {Number|String}
 *         [height] {Number|String}
 *         [parent] {HTMLElement}
 *         [flow] {String}
 *     }
 *
 * @return {Box}
 */
api.createBox = function createBox(setup) {
    var flow,
        box;

    setup = setup || {};

    flow = setup.flow;
    box = new Box(
        setup.width,
        setup.height,
        (setup.parent || setup.container)
    );

    return box.setFlowDirection(flow).setComponent(setup.component);
};
/**
 * @param setup {Object} map of settings
 *
 * Schema: {
 *         [width] {Number|String}
 *         [height] {Number|String}
 *         [left] {Number|String}
 *         [right] {Number|String}
 *     }
 *
 * @return {Dialog}
 */
api.createDialog = function createDialog(setup) {
    var dialog;

    setup = setup || {};

    dialog = new Dialog(
        setup.width,
        setup.height,
        setup.left,
        setup.right
    );

    return dialog;
};
