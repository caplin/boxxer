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
 * @param {int} nWidth The width of the frame, in pixels.
 * @param {int} nHeight The height of the frame, in pixels.
 */
LifeCycle.prototype.onOpen = function(nWidth, nHeight) {};

/**
 * Invoked when the frame containing this component is closed.
 *
 * <p>This method should be used to clean up any resources the component currently has open,
 * including subscriptions and any other listeners that may have been registered. Once
 * <code>onClose()</code> has been called no further methods will be called for this
 * component.</p>
 *
 * <p>It is possible for the <code>onClose()</code> method to be invoked before
 * <code>onOpen()</code> if the component was instantiated but never displayed (for example if the
 * user was not permissioned to view the component) in which case this method should only be used
 * to clean up any resources it has opened within its constructor, and not those that it would
 * have opened within <code>onOpen()</code>.</p>
 */
LifeCycle.prototype.onClose = function() {};

/**
 * Invoked when a box that has been hidden (see {@link #onHide}) is now back in view. It
 * should restore any resources that were stopped or suspended by <code>onHide()</code>.
 *
 * <p>Note that this method is not called when the component within the frame is first
 * displayed (see {@link #onOpen}).</p>
 */
LifeCycle.prototype.onShow = function() {};

/**
 * Invoked when a frame is no longer in view. It should stop or suspend any resources that may
 * be processor intensive, such as subscriptions, so they are not active whilst the
 * frame is hidden.
 *
 * @see #onShow
 */
LifeCycle.prototype.onHide = function() {};

/**
 * Invoked when the frame has been minimized.
 *
 * @see #onRestore
 */
LifeCycle.prototype.onMinimize = function() {};

/**
 * Invoked when the frame has been maximized.
 *
 * @see #onRestore
 */
LifeCycle.prototype.onMaximize = function() {};

/**
 * Invoked when the frame has been restored from a minimized or maximized state.
 *
 * @see #onMinimize
 * @see #onMaximize
 */
LifeCycle.prototype.onRestore = function() {};

/**
 * Invoked when the dimensions of the frame change.
 *
 * @param {int} nWidth The new width of the frame, in pixels.
 * @param {int} nHeight The new height of the frame, in pixels.
 */
LifeCycle.prototype.onResize = function(nWidth, nHeight) {};

/**
 * Invoked when the frame becomes the active or focused frame within the page.
 */
// TODO this is not ideal as API onFocus would be better but we can create an alias
LifeCycle.prototype.onActivate = function() {};

/**
 * Invoked when the frame ceases to be the active or focused frame within the page.
 */
// TODO this is not ideal as API onBlur would be better but we can create an alias
LifeCycle.prototype.onDeactivate = function() {};

/**
 * Invoked when the frame ceases to be the active or focused frame within the page.
 */
LifeCycle.prototype.onFlowChange = function() {};