boxxer.register("mixins", "SortHandler", function (b) {
    var sAddEvent = "addEventListener";
    var sRemoveEvent = "removeEventListener";
    var sTriggerEvent = "dispatchEvent";
    var sMouseDown = "mousedown";
    var sMouseMove = "mousemove";
    var sMouseUp = "mouseup";

    //IE specific overrides
    if (document.attachEvent !== undefined &&
        document.detachEvent !== undefined)
    {
        sAddEvent = "attachEvent";
        sRemoveEvent = "detachEvent";
        sTriggerEvent = "fireEvent";
        sMouseDown = "onmousedown";
        sMouseMove = "onmousemove";
        sMouseUp = "onmouseup";
    }

    /**
     * TODO: finish drag and drop sorting functionality
     * @description decorates each Box instance with event handling functionality.
     * @mixin
     * @constructor SortHandler
     */
    function SortHandler() {
        var eElement = this.getElement();
        eElement[sAddEvent](sMouseDown, this.mouseDown.bind(this));
    }

    /**
     * callback for each mousedown event on the Box instances DOM representation
     * @param evt {Event}
     */
    SortHandler.prototype.mouseDown = function (evt) {
        if (typeof evt.stopPropagation === "function" &&
            typeof evt.preventDefault === "function")
        {
            evt.preventDefault();
            evt.stopPropagation();
        } else {
            //IE fix
            evt.cancelBubble = true;
            evt.returnValue = false;
        }

        var oElemRect = b.utils.getEventTarget(evt).getBoundingClientRect();
        var oCloneNode = this.clone(evt, oElemRect);
        var nXOffset = (evt.pageX || evt.clientX) - oElemRect.left;
        var nYOffset = (evt.pageY || evt.clientY) - oElemRect.top;

        function mouseMove(evt) {
            //TODO: IE8 sais that oCloneNode.style is null. Fix it!
            oCloneNode.style.left = ((evt.pageX || evt.clientX) - nXOffset) + "px";
            oCloneNode.style.top = ((evt.pageY || evt.clientY) - nYOffset) + "px";
        }

        function mouseUp() {
            //removing the cloned node
            b.utils.getBody().removeChild(oCloneNode);

            //unsubscribing all events
            document[sRemoveEvent](sMouseMove, mouseMove);
            document[sRemoveEvent](sMouseUp, mouseUp);
        }

        //subscribing for events
        document[sAddEvent](sMouseMove, mouseMove);
        document[sAddEvent](sMouseUp, mouseUp);
    };

    /**
     * creates and returns a clone node for dragging visual feedback
     * @param evt {Event} event
     * @param oRect {ClientRect} ClientRect of the original HTMLElement
     * @returns {Node}
     */
    SortHandler.prototype.clone = function (evt, oRect) {
        var body = b.utils.getBody();
        var oClone = b.utils.getEventTarget(evt).cloneNode(true);
        var eRenderer = b.utils.getRenderer();

        eRenderer.appendChild(oClone);
        eRenderer.removeChild(oClone);

        oClone.style.cursor = "move";
        oClone.style.position = "absolute";
        oClone.style.top = oRect.top + "px";
        oClone.style.left = oRect.left + "px";
        oClone.style.background = SortHandler.getBackground();
        oClone.style.boxShadow = SortHandler.getDropShadow();
        oClone.style.opacity = SortHandler.getOpacity();

        body.appendChild(oClone);

        return oClone;
    };

    /**
     * TODO: research properly and implement this metod properly
     * @param oOriginal {Event} original event to clone
     * @returns {Event}
     */
    SortHandler.prototype.cloneMouseEvent = function (oOriginal) {
        var oClone = document.createEvent("MouseEvent");

        oClone.initMouseEvent(
            oOriginal.type,
            true,
            true,
            window,
            0,
            oOriginal.screenX,
            oOriginal.screenY,
            oOriginal.clientX,
            oOriginal.clientY,
            oOriginal.ctrlKey,
            oOriginal.altKey,
            oOriginal.shiftKey,
            oOriginal.metaKey,
            oOriginal.button,
            null
        );

        return oClone;
    };

    /**
     * patch this if different value is needed
     * @returns {string}
     */
    SortHandler.getDropShadow = function () {
        return "0 1px 1em rgba(0, 0, 0, 0.5)";
    };

    /**
     * patch this if different value is needed
     * @returns {number}
     */
    SortHandler.getOpacity = function () {
        return 0.5;
    };

    /**
     * patch this if different value is needed
     * @returns {string}
     */
    SortHandler.getBackground = function () {
        return "#eaeaea";
    };

    //temporary exposition of namespace for WebStorm/IntelliJ object member visibility support
    b.mixins.SortHandler = SortHandler;

    return SortHandler;
});