exports.BoxRenderer = BoxRenderer;

/**
 * This class is responsible for rendering a Box instance and its child Box instances recursively
 * @static
 * @constructor BoxRenderer
 */
function BoxRenderer() {}

/**
 * set the given element as an inline-block element
 * @param element {HTMLElement}
 */
BoxRenderer.setElementInline = function (element) {
    element.style.display = "inline-block";
    element.style.verticalAlign = "top";
};

/**
 * renders a given Box instance to the DOM
 * @param box {Box} Box to render
 * @param parent {HTMLElement} the parent HTMLElement to render in
 * @param flowDirection {String} the direction of the flow inside the parent
 */
BoxRenderer.render = function (box, parent, flowDirection) {
    if (!(box instanceof Box)) {
        throw new TypeError("Invalid argument - not a box!");
    }

    var element = box.getElement();
    var view = box.view;

    // TODO: apply overflow: auto when the Box instance current size
    // is smaller then the total width of the child FixBox instances
    // otherwise the layout collapses
    // eElement.style.overflow = "auto";

    if (typeof flowDirection === "undefined" ||
        typeof parent === "undefined")
    {
        parent = box.getParentElement();
        flowDirection = box.getFlowDirection();

        if (flowDirection === Box.FLOW_HORIZONTAL) {
            BoxRenderer.setElementInline(element);
        }

        box.setDimensions(parent.offsetWidth, parent.offsetHeight);
    } else {
        if (flowDirection === Box.FLOW_HORIZONTAL) {
            BoxRenderer.setElementInline(element);
        }
    }

    /* TODO:
     *    We might want to separate the update and the render methods.
     *
     *    Reason:
     *        Event subscriptions. We would be able to separate event subscriptions
     *        for both the render and the update events
     *
     * do not append if already appended - makes perfect sense...
     */
    if (element.parentNode !== parent) {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }

        parent.appendChild(element);
    }

    if (!box.isRendered) {
        BoxRenderer._applyDecorators(box);
    }

    BoxRenderer._postRender(box, view, element);
};

/**
 * applies (engages) the added decorators for a Box
 * @private
 * @param box {Box}
 */
BoxRenderer._applyDecorators = function (box) {
    box.getDecoratorNames().forEach(function(decoratorName) {
        box._decorators.push(Decorator.get(decoratorName, box));
    });
};

/**
 * render after the Box instance itself has been rendered
 * @private
 * @param box {Box}
 * @param view {ViewContainer}
 * @param element {HTMLElement}
 */
BoxRenderer._postRender = function (box, view, element) {
    var viewContent;
    var tempElement;

    if (box.getChildCount()) {
        this._renderChildren(box, element, box.getFlowDirection());
    }

    //TODO: test this part because this has been implemented quickly!
    if (view instanceof ViewContainer) {
        viewContent = view.render(element);

        if (viewContent) {
            if (viewContent instanceof Node) {
                element.appendChild(viewContent);
            } else if (typeof viewContent === "string") {
                tempElement = document.createElement("div");
                tempElement.innerHTML = viewContent;
                //append content wrapper firstChildElement
                element.appendChild(tempElement.firstElementChild);
            }
        }
    }
};

/**
 * prepares the child Box instances and all the required properties  for rendering
 * @private
 * @param box {Box}
 * @param element {HTMLElement}
 * @param flowDirection {String}
 */
// the real percentage values based on the element size, therefore weight
// dimensions cannot work properly with percentage dimensions
BoxRenderer.resolveAndSortChildren = function (box, element, flowDirection) {
    var order = [];
    var isHorizontal = flowDirection === Box.FLOW_HORIZONTAL;
    var property = (isHorizontal ? "width" : "height");
    var elementDimension = element["offset" + (isHorizontal ? "Width" : "Height")];
    var children = box.getChildren();
    var pxBoxes = {}, pcBoxes = {}, wBoxes = {};
    var percents = 0, pixels = 0, weights = 0;
    var dimension, child, c;

    for (c in children) {
        if (children.hasOwnProperty(c)) {
            child = children[c];
            dimension = child[property];

            switch (dimension.getType()) {
                case Dimension.PERCENT:
                    pcBoxes[c] = child;
                    percents += Math.floor(elementDimension * (dimension.getValue() / 100));
                    break;
                case Dimension.PIXEL:
                    pxBoxes[c] = child;
                    pixels += dimension.getValue();
                    break;
                default:
                    wBoxes[c] = child;
                    weights += dimension.getValue();
            }

            order.push(c);
        }
    }

    return {
        order: order,
        method: (flowDirection === Box.FLOW_VERTICAL ? "Width" : "Height"),
        dimension: (flowDirection === Box.FLOW_HORIZONTAL ? "Width" : "Height"),
        pixelBoxes: pxBoxes,
        percentBoxes: pcBoxes,
        weightBoxes: wBoxes,
        percents: percents,
        weights: weights,
        pixels: pixels
    }
};

/**
 * renders the children of the Box
 * @private
 * @param box {Box}
 * @param element {HTMLElement}
 * @param flowDirection {String}
 */
BoxRenderer._renderChildren = function (box, element, flowDirection) {
    var sorted = this.resolveAndSortChildren(box, element, flowDirection);
    var children = box.getChildren();
    var order = sorted.order;
    var WEIGHT = Dimension.WEIGHT;
    var stretch,
        total,
        dimensionType,
        available,
        width,
        height,
        calculatedWidth,
        calculatedHeight,
        child;

    //taking the proper dimension from the parent to stretch to and count with
    if (flowDirection === Box.FLOW_HORIZONTAL) {
        stretch = element.offsetHeight;
        total = element.offsetWidth;
    } else {
        stretch = element.offsetWidth;
        total = element.offsetHeight;
    }

    //available space for weighted flexible dimensions
    available = total - sorted.percents - sorted.pixels;

    while (order.length > 0) {
        child = children[order.shift()];
        width = child.width;
        height = child.height;

        //calculating dimensions based on the dimension type
        if (flowDirection === Box.FLOW_HORIZONTAL) {
            dimensionType = width.getType();
            //if the dimension is weighted, use the available space, otherwise use the total
            calculatedWidth = width.calculate(
                dimensionType === WEIGHT ? available : total, sorted.weights);
            calculatedHeight = height.calculate(stretch, 1);
        } else {
            dimensionType = height.getType();
            calculatedWidth = width.calculate(stretch, 1);
            //if the dimension is weighted, use the available space, otherwise use the total
            calculatedHeight = height.calculate(
                dimensionType === WEIGHT ? available : total, sorted.weights);
        }

        //setting the dimensions
        child.setDimensions(calculatedWidth, calculatedHeight);
        child.render();
    }
};
