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

    var config = setup || {};
    var box = new Box(
            config.width,
            config.height,
            (config.parent || config.container)
        )
        .setFlowDirection(config.flow)
        .setComponent(config.component);

    if (config.decorators) {
        config.decorators.forEach(function(decoratorName) {
            box.addDecorator(decoratorName);
        });
    }

    if (config.name) {
        box.setName(config.name);
    }

    if (config.className) {
        box.addClass(config.className);
    }

    return box;
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
