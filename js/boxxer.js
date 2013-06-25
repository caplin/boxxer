var global = this;
/**
 * boxxer object
 * @type {Object}
 */
var exports = {};

/**
 * boxxer API object
 * @type {Object}
 * @namespace
 */
var api = Object.create(exports);

/**
 * old boxxer
 * @type {Object}
 */
var _boxxer = global.boxxer;

/**
 * renderer element
 * @type {HTMLElement}
 */
var renderer = document.createElement("div");
//hide the renderer element to prevent unnecessary reflows
renderer.style.display = "none";

if (_boxxer) {
    exports._boxxer = _boxxer;
}

//export API object
global.boxxer = api;

/**
 * descendant class level constructor
 * @constructor Surrogate
 */
function Surrogate() {}

/**
 * determines whether boxxer should be built in debug mode
 * @return {Boolean}
 */
function debugMode() {
    return (global.boxxer_debug === true);
}

/**
 * removes an element from its parent element
 * @param element {HTMLElement}
 */
function removeElement(element) {
    var parent = element.parentNode;

    if (parent) {
        parent.removeChild(element);
    }
}

/**
 * returns the browser specific target Element in an Event object
 * @param evt {Event}
 * @returns {Object}
 */
function getEventTarget(evt) {
    return (evt.target || evt.srcElement);
}

/**
 * returns the document body
 * @private
 * @static
 * @return {HTMLElement}
 */
function getBody() {
    return document.body;
}

/**
 * initializes a renderer element by appending it to the DOM and hiding it
 * @param eElement {HTMLElement|undefined} parent to append the renderer element to
 */
function init(eElement) {
    //appending invisible renderer element
    (eElement || getBody()).appendChild(renderer);
}

/**
 * returns the renderer element
 * @returns {HTMLElement}
 */
function getRenderer() {
    return renderer;
}

/**
 * extender - inheritance resolver
 * @param subClass {Function} sub class - surprised on this?
 * @param superClass {Function} super class - the Force is strong with this one...
 */
function inherit(subClass, superClass) {
    var TemporarySuperClass = function () {};

    if (debugMode()) {
        //I know, but I still prefer the
        //clean visual prototype chain
        //with proper class names instead
        //of "__proto__ > haku.nama.tata"
        eval("TemporarySuperClass = function " + subClass.name + "() {};");
    }

    TemporarySuperClass.prototype = superClass.prototype;

    subClass.prototype = new TemporarySuperClass();
    subClass.prototype.constructor = subClass;
}

/**
 * mixes two classes by their prototype
 * @param mainClass {Function} class getting partial stuff
 * @param mixClass {Function} partial class implementation
 */
function mix(mainClass, mixClass) {
    var i;

    for (i in mixClass.prototype) {
        if (mixClass.prototype.hasOwnProperty(i)) {
            mainClass.prototype[i] = mixClass.prototype[i];
        }
    }
}

//expose registering method
exports.Surrogate = Surrogate;

//expose core utility functions
exports.mix = mix;
exports.inherit = inherit;
exports.debugMode = debugMode;

//expose utility functions
exports.utils = {
    getBody : getBody,
    getRenderer : getRenderer,
    getEventTarget : getEventTarget,
    removeElement: removeElement
};

//expose initialize function
exports.init = init;