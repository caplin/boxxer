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

    setup = setup || {};

    return new Box(
            setup.width,
            setup.height,
            (setup.parent || setup.container)
        )
        .setFlowDirection(setup.flow)
        .setComponent(setup.component);
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

    setup = setup || {};

    return new Dialog(
        setup.width,
        setup.height,
        setup.left,
        setup.right
    );
};
