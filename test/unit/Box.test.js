(function (Box, Dimension) {

    module("Box");

    function each(context, literal) {
        var array = literal.split(",");
        var p;

        while (array.length > 0) {
            p = array.shift();
            notEqual(context[p], undefined, p);
        }
    }

    test("static", function () {
        var finals = "MIN_DIMENSION,FLOW_VERTICAL,FLOW_HORIZONTAL";
        var publics = "generateUniqueBoxId,removeBox,getById,clean";
        var privates = "_registry,_id";

        each(Box, finals);
        each(Box, publics);
        each(Box, privates);
    });

    test("instance", function () {
        var box = new Box("150px", "150px", {});
        var privates = "_id,_flowDirection,_children,_element,_parentElement";
        var privateMethods = "_setElementWidth,_setElementHeight";
        var publicMethods = "addChild,addBox," +
            "getId,getFlowDirection,setFlowDirection," +
            "getChild,getChildren,removeChild,getChildCount," +
            "render," +
            "setWidth,getWidth,setHeight,getHeight," +
            "getElement,getParentElement,setParentElement," +
            "addClass,hasClass," +
            "html,text," +
            "getAttribute,setAttribute,getDataAttribute,setDataAttribute";

        each(Box.prototype, privateMethods);
        each(Box.prototype, publicMethods);

        each(box, privates);
        each(box, privateMethods);
        each(box, publicMethods);

        ok(box.width instanceof Dimension);
        ok(box.height instanceof Dimension);
    });

}(
    boxxer.Box,
    boxxer.render.Dimension
));