//Object.keys shim
if (typeof Object.keys === 'undefined') {
	Object.keys = function (object) {
		var keys = [],
            key;

		for (key in object) {
			if (object.hasOwnProperty(key)) {
				keys.push(key);
			}
		}

		return keys;
	}
}

//Object.hasOwnProperty shim - needs to be tested
if (typeof Object.prototype.hasOwnProperty === 'undefined') {
    Object.prototype.hasOwnProperty = function (property) {
        //assuming that the inheritance didn't screw up the constructor...
        return (this[property] && !this.constructor.prototype[property]);
    }
}

//Function.bind shim
//TODO: works, but needs to be tested
if (typeof Function.prototype.bind !== "function") {
    Function.prototype.bind = function () {
        if (typeof this !== "function") {
            throw new TypeError("Object #<Object> has no method 'bind'");
        }

        var args = Array.prototype.slice(arguments);
        var context = args.shift();
        var that = this;

        return function () {
            return that.apply(context, args.concat(Array.prototype.slice.call(arguments)));
        }
    }
}

//Array.prototype.indexOf shim
//TODO: works, but needs to be tested
if (typeof Array.prototype.indexOf !== "function") {
    Array.prototype.indexOf= function (search) {
        var i = 0,
            len = this.length;

        for (; i < len; i++) {
            if (search === this[i]) {
                return i;
            }
        }

        return -1;
    }
}
