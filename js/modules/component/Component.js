exports.Component = Component;

/**
 * @interface
 * @class
 * This interface must be implemented by a presentation-level class.
 * A presentation-level class represents something that occupies physical space in the page
 * container, such as the content of a panel or a dialog box. <code>Component</code> extends the
 * {@link ComponentLifecycleEvents} interface which defines the life cycle
 * events that may be raised by the container in response to the user's interaction with it. The
 * <code>Component</code> is automatically registered with its container so that it receives these
 * life cycle event callbacks.
 *
 * <p>Each implementation of a Component represents a different <b>Component type</b>,
 * for example a Grid or a Trade Panel.</p>
 *
 * <p>Each subclass of <code>Component</code> must have an createFromSerializedState method
 * which is responsible for constructing new instances of the Component.
 *
 * <p>The windowing environment, which provides the container within which the component exists,
 * may only use a subset of the <code>Component</code> interface. A component therefore should be
 * implemented so that it will work even if the (mandatory) methods {@link #getElement} and
 * {@link LifeCycle#onOpen} are the only methods the windowing environment will invoke.</p>
 *
 * <p>The windowing environment determines whether the event methods are called immediately after
 * or immediately before the event they refer to.</p>
 *
 * <p><code>Component</code> instances that have been configured via XML or saved as part of a
 * layout are instantiated by the ComponentFactory. As such a
 * <code>Component</code> must be registered with the using the factory's
 * ComponentFactory.registerComponent method, passing
 * in the name of the root XML tag that represents the component and a suitable static factory
 * method can instantiate it.
 * @constructor
 *
 * @implements LifeCycle
 * @component
 */
function Component() {}

/**
 * Returns a reference to the container that is hosting this component. If no container has been
 * set then this will return undefined.
 *
 * @deprecated
 * @return {Box} box The box hosting this component.
 */
Component.prototype.getContainer = function () {
    return this.container;
};

/**
 * Provides a reference to the container that will be hosting this component.
 *
 * @deprecated
 * @see #setFrame
 * @param {box} box The container hosting this component.
 */
Component.prototype.setContainer = function (box) {
    this.container = box;
};

/**
 * Just leaving it for now just in case but not sure we need it
 * @deprecated
 */
Component.prototype.setFrame = Component.prototype.setContainer;

/**
 * Gets a guaranteed ID for this component instance.
 * @type String
 * @return A unique ID
 * @throws {Error} if this method is not implemented by the subclass.
 */
// TODO do we need this as boxes have an ID? I guess so but need to look into it
Component.prototype.getUniqueComponentId = function () {
    throw new Error("Component.getUniqueComponentId() has not been implemented.");
};

/**
 * Invoked when the windowing environment needs to display this component. It returns the HTML
 * element that must be added to the DOM to represent this component. <code>getElement()</code>
 * is invoked before any of the other <code>Component</code> interface methods.
 *
 * <p>This method is compulsory, and must be implemented.</p>
 *
 * <p>It should be designed execute quickly, as the windowing environment may freeze
 * until it has returned.</p>
 *
 * @type HtmlElement
 * @return The root <code>HtmlElement</code> used to display this component on a web page.
 * Must not be <code>null</code> or <code>undefined</code>.
 * @throws {Error} if this method is not implemented by the subclass.
 */
Component.prototype.getElement = function () {
    throw new Error("Component.getElement() has not been implemented.");
};

/**
 * Invoked when the windowing environment needs to save the state of this component. It returns an
 * XML string or JSON object representation of the state.
 *
 * <p>This method is compulsory, and must be implemented.</p>
 *
 * <p>Example:</p>
 *
 * <pre>
 * mybank.MyComponent = function()
 * {
 *	this.m_sSubject = null;
 * };
 * caplin.implement(mybank.MyComponent, Component);
 *
 * mybank.MyComponent.setSubject = function(sSubject)
 * {
 *	this.m_sSubject = sSubject;
 * };
 *
 * // other Component methods ...
 *
 * mybank.MyComponent.getSerializedState = function()
 * {
 *	return "&lt;myComponent subject=\"" + this.m_sSubject + "\" /&gt;";
 * };
 * </pre>
 *
 * @type String
 * @return An XML string representation of the state of this component.
 * Must not be <code>null</code> or <code>undefined</code>.
 * @throws {Error} if this method is not implemented by the subclass.
 */
// TODO update jsdoc with JSON example instead of XML
Component.prototype.getSerializedState = function () {
    throw new Error("Component.getSerializedState() has not been implemented.");
};

/**
 * Invoked so the container can determine whether the component is currently permissioned for use.
 *
 * @return The set of permissioning information that can be used to query
 * {@link caplin.services.security.PermissionService#canUserPerformAction}.
 * @type caplin.services.security.PermissionKey
 */
// TODO Something with this...
Component.prototype.getPermissionKey = function () {};
