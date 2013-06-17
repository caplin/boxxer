(function (_g) {
    /**
     * boxxer object
     * @public
     * @type {Object}
     */
    var boxxer = {};

    /**
     * descendant class level constructor
     * @constructor Surrogate
     */
    function Surrogate() {}

    //renderer element
    var renderer = document.createElement("div");
    //hide the renderer element to prevent unnecessary reflows
    renderer.style.display = "none";

    /**
     * determines whether boxxer should be built in debug mode
     * @return {Boolean}
     */
    function debugMode() {
        return (_g.boxxer_debug === true);
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

    /**
     * registers a namespace or a class for the given path
     * @param rawPath {String} path to resolve
     * @param name {String} the property to set
     * @param value {*} whateva'...
     * @param [context] {Object} context to resolve the path on and for callback - optional
     */
    function register(rawPath, name, value, context) {
        var path = rawPath.split("."),
            currentContext = (context || boxxer),
            property;

        while (path.length > 0) {
            property = path.shift();

            if (property) {
                if(!currentContext.hasOwnProperty(property)) {
                    currentContext[property] = {};
                }
                currentContext = currentContext[property];
            }
        }

        currentContext[name] = (typeof value === "function" ?
            value((context || this), currentContext) : value);
    }

    /**
     * registers a namespace or a class for the given path
     * @param classPath {String} path to resolve
     * @param callback {Function} callback
     * @param [context] {Object} context to resolve the path on and for callback - optional
     */
    function patch(classPath, callback, context) {
        var path = classPath.split("."),
            currentContext = (context || boxxer),
            prop;

        if (typeof callback === "function") {
            while (path.length > 0 && currentContext) {
                prop = path.shift();

                if (prop) {
                    if(!currentContext.hasOwnProperty(prop)) {
                        currentContext[prop] = {};
                    }
                    currentContext = currentContext[prop];
                }
            }

            callback(currentContext);
        }
    }

    //expose registering method
    boxxer.register = register;
    boxxer.Surrogate = Surrogate;

    //expose core utility functions
    boxxer.mix = mix;
    boxxer.inherit = inherit;
    boxxer.debugMode = debugMode;

    //expose utility functions
    boxxer.utils = {
        getBody : getBody,
        getRenderer : getRenderer,
        getEventTarget : getEventTarget
    };

    if (debugMode()) {
        boxxer.utils.patch = patch;
    }

    //expose initialize function
    boxxer.init = init;

    _g.boxxer = boxxer;
}(window));