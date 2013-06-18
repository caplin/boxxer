boxxer.register("mixins", "Serializer", function (b) {

    /**
     * @constructor provides serializer method for each Box instance to serialize their state
     * @mixin
     * @static
     */
    function Serializer() {}

    /**
     * serializes a hierarchy of Box instances
     * @param format {String} either "xml" or "json"
     * @param name {String} the name of the Box instance in the collection
     * @returns {String}
     */
    Serializer.prototype.serialize = function (format, name) {
        var serializedBox;

        if (format === Serializer.JSON) {
            serializedBox = Serializer.toJSON(this, name);
        } else {
            serializedBox = Serializer.toXML(this, name);
        }

        return serializedBox;
    };

    /**
     * serializes the given Box instance to JSON format
     * @param box {boxxer.Box} the Box to serialize
     * @param name {String} the name of the Box instance in the collection
     * @returns {string}
     */
    Serializer.toJSON = function (box, name) {
        var child;
        var children;
        var view = box.view;
        var childCount = box.getChildCount();
        var decorators = box.getDecorators();
        var json = "{" +
            "\"id\":" + Number(box.getId().replace("bbox_", "")) + "," +
            "\"flow\":\"" + box.getFlowDirection() + "\"," +
            Serializer.getJSONAttributes(box);

        if (typeof name === "string" && name !== "") {
            json += ",\"name\":\"" + name + "\"";
        }

        if (decorators.length > 0) {
            json += ",\"decorators\":[";
            json += decorators.join(",");
            json +="]";
        }

        if (childCount > 0) {
            json += ",\"children\":[";
            children = box.getChildren();

            for (child in children) {
                if (children.hasOwnProperty(child)) {
                    json += children[child].serialize(Serializer.JSON, child);
                    childCount--;

                    if (childCount > 0) {
                        json += ",";
                    }
                }
            }

            json += "]";
        }

        if (view instanceof b.view.View) {
            json += ", view:" + view.serialize();
        }

        json += "}";

        return json;
    };

    /**
     * serializes the given Box instance to XML format
     * @param box {boxxer.Box} the Box to serialize
     * @param name {String} the name of the Box instance in the collection
     * @returns {string}
     */
    Serializer.toXML = function (box, name) {
        var child;
        var children;
        var decorators = box.getDecorators();
        var xml = "<bbox" +
            " id='" + Number(box.getId().replace("bbox_", "")) + "'" +
            " flow='" + box.getFlowDirection() + "'";

        if (typeof name === "string" && name !== "") {
            xml += " name='" + name + "'";
        }

        xml += Serializer.getXMLAttributes(box) + ">";

        if (decorators.length > 0) {
            xml += " decorators='";
            xml += decorators.join(",");
            xml +="'";
        }

        if (box.getChildCount()) {
            children = box.getChildren();

            for (child in children) {
                if (children.hasOwnProperty(child)) {
                    xml += children[child].serialize(Serializer.XML, child);
                }
            }
        }

        xml += "</bbox>";

        return xml;
    };

    /**
     * returns the dimension attributes for the given Box instance for JSON format
     * @param box {boxxer.Box}
     * @returns {string}
     */
    Serializer.getJSONAttributes = function (box) {
        return "\"width\":" + box.getWidth().getSerializedValue() + "," +
            "\"height\":" + box.getHeight().getSerializedValue() + "";
    };

    /**
     * returns the dimension attributes for the given Box instance for XML format
     * @param box {boxxer.Box}
     * @returns {string}
     */
    Serializer.getXMLAttributes = function (box) {
        return " width='" + box.getWidth().getSerializedValue() + "' " +
            "height='" + box.getHeight().getSerializedValue() + "'";
    };

    /**
     * deserializes the serialized Box hierarchy
     * @param serialized {String} hierarchy of Boxes
     * @returns {Object|Element}
     */
    Serializer.deserialize = function (serialized) {
        var div;
        var box;
        var test;
        var result;
        var format;

        try {
            test = JSON.parse(serialized);

            if (test instanceof Object) {
                format = Serializer.JSON;
                result = test;
            }
        } catch (e) {
            div = document.createElement("div");
            div.innerHTML = serialized;
            box = (div.firstElementChild || div.children[0]);

            if (box && box.tagName.toLowerCase() === "bbox") {
                format = Serializer.XML;
                result = box;
            }
        }

        if (result !== undefined) {
            result = Serializer.buildHierarchy(result, format);
        }

        return result;
    };

    /**
     * constructs and returns a hierarchy of box instances based on the arguments
     * @param hierarchy {Object|Element}
     * @param format {String}
     * @returns {boxxer.Box|undefined}
     */
    Serializer.buildHierarchy = function (hierarchy, format) {
        var box;
        var childBox;
        var decorators;
        var child;
        var i;

        if (format === Serializer.JSON) {
            box = new b.Box();
            box.setFlowDirection(hierarchy.flow);
            box.setWidth(hierarchy.width);
            box.setHeight(hierarchy.height);

            if (hierarchy.decorators) {
                decorators = hierarchy.decorator.replace(" ", "").split(",");

                while (decorators.length > 0) {
                    box.addDecorator(decorators.shift());
                }
            }

            if (hierarchy.children && hierarchy.children.length > 0) {
                for (i = 0; i < hierarchy.children.length; i++) {
                    child = hierarchy.children[i];
                    childBox = box.addBox(Serializer.buildHierarchy(child, format), child.name);
                }
            }
        } else if (format === Serializer.XML) {
            box = new b.Box();

            box.setFlowDirection(hierarchy.getAttribute("flow"));
            box.setWidthDimension(hierarchy.getAttribute("width"));
            box.setHeightDimension(hierarchy.getAttribute("height"));

            if (hierarchy.getAttribute("decorators")) {
                decorators = hierarchy.getAttribute("decorators").replace(" ", "").split(",");

                while (decorators.length > 0) {
                    box.addDecorator(decorators.shift());
                }
            }

            if (hierarchy.children && hierarchy.children.length) {
                for (i = 0; i < hierarchy.children.length; i++) {
                    child = hierarchy.children[i];
                    childBox = box.addBox(Serializer.buildHierarchy(child, format), child.getAttribute("name"));
                }
            }
        }

        return box;
    };

    /**
     * @static
     * @type {string}
     */
    Serializer.XML = "xml";

    /**
     * @static
     * @type {string}
     */
    Serializer.JSON = "json";

    //temporary exposition of namespace for WebStorm/IntelliJ object member visibility support
    b.mixins.Serializer = Serializer;

    return Serializer;
});
