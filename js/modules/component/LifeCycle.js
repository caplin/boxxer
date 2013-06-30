exports.LifeCycle = LifeCycle;

/**
 * @beta
 * @class
 * <p>Component life cycle events are emitted by the box instances. Overriding any of the methods
 * in this listener interface is optional, but doing so will enable you to react to the related
 * event.</p>
 *
 * @constructor
 * @interface
 */
function LifeCycle() {}

/**
 * Invoked when the frame is first displayed. It will only ever be called once when the box instance is rendered to the
 * document so that dimensions can be calculated.
 *
 * @param box {Box}
 */
LifeCycle.prototype.onOpen = function(box) {};

/**
 * Invoked when the frame containing this component is closed.
 *
 * <p>This method should be used to clean up any resources the component currently has open,
 * including subscriptions and any other listeners that may have been registered. Once
 * <code>onClose()</code> has been called no further methods will be called for this
 * component.</p>
 *
 * @param box {Box}
 */
LifeCycle.prototype.onClose = function(box) {};

/**
 * Invoked when a box that has been hidden (see {@link #onHide}) is now back in view. It
 * should restore any resources that were stopped or suspended by <code>onHide()</code>.
 *
 * <p>Note that this method is not called when the component within the frame is first
 * displayed (see {@link #onOpen}).</p>
 *
 * @param box {Box}
 */
LifeCycle.prototype.onShow = function(box) {};

/**
 * Invoked when a frame is no longer in view. It should stop or suspend any resources that may
 * be processor intensive, such as subscriptions, so they are not active whilst the
 * frame is hidden.
 *
 * @see #onShow
 *
 * @param box {Box}
 */
LifeCycle.prototype.onHide = function(box) {};

/**
 * Invoked when the frame has been minimized.
 *
 * @see #onRestore
 *
 * @param box {Box}
 */
LifeCycle.prototype.onMinimize = function(box) {};

/**
 * Invoked when the frame has been maximized.
 *
 * @see #onRestore
 *
 * @param box {Box}
 */
LifeCycle.prototype.onMaximize = function(box) {};

/**
 * Invoked when the frame has been restored from a minimized or maximized state.
 *
 * @see #onMinimize
 * @see #onMaximize
 *
 * @param box {Box}
 */
LifeCycle.prototype.onRestore = function(box) {};

/**
 * Invoked when the dimensions of the frame change.
 *
 * @param box {Box}
 */
LifeCycle.prototype.onResize = function(box) {};

/**
 * Invoked when the frame becomes the active or focused frame within the page.
 *
 * @param box {Box}
 */
// TODO this is not ideal as API onFocus would be better but we can create an alias
LifeCycle.prototype.onActivate = function(box) {};

/**
 * Invoked when the frame ceases to be the active or focused frame within the page.
 *
 * @param box {Box}
 */
// TODO this is not ideal as API onBlur would be better but we can create an alias
LifeCycle.prototype.onDeactivate = function(box) {};

/**
 * Invoked when the frame ceases to be the active or focused frame within the page.
 *
 * @param box {Box}
 */
LifeCycle.prototype.onReflow = function(box) {};