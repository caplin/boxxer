module("boxxer");

test('structure', function() {

    var aPrivates = 'renderer,debugMode,getEventTarget,getBody,init,getRenderer,inherit,mix'.split(','),
        aPublics = 'mix,inherit,debugMode,utils,init'.split(','),
        aUtils = 'getBody,getRenderer,getEventTarget'.split(','),
        each = function(aData, fCallback) {

            var nLen = aData.length,
                i = 0;

            for (; i < nLen; i++) {
                fCallback.apply(null, [aData[i]]);
            }
        };

    ok(window.boxxer, 'boxxer exists');
    equal(typeof window.boxxer, 'object', 'boxxer is an object');

    each(aPrivates, function(sPrivate) {
        equal(window[sPrivate], undefined, sPrivate + ' is private');
    });

    each(aPublics, function(sPublic) {
        ok(boxxer[sPublic], 'boxxer.' + sPublic + ' is public');
        if (sPublic !== 'utils') {
            equal(typeof boxxer[sPublic], 'function', sPublic + ' is a function');
        } else {
            equal(typeof boxxer[sPublic], 'object', sPublic + ' is an object');
        }
    });

    each(aUtils, function(sUtil) {
        ok(boxxer.utils[sUtil], 'boxxer.utils.' + sUtil + ' is public');
        equal(typeof boxxer.utils[sUtil], 'function', 'boxxer.utils.' + sUtil + ' is a function');
    });
});
test('functionality', function() {

    var mockEvent = { target: 'foo' };
    deepEqual(boxxer.utils.getEventTarget(mockEvent), mockEvent.target, '.utils.getEventTarget() - target');

    mockEvent = { srcElement: 'foo'  };
    deepEqual(boxxer.utils.getEventTarget(mockEvent), mockEvent.srcElement, '.utils.getEventTarget() - srcElement');

    deepEqual(boxxer.utils.getBody(), document.body, '.utils.getBody()');

    var div = document.createElement('div');
    boxxer.init(div);
    deepEqual(boxxer.utils.getRenderer(), div.childNodes[0], '.utils.getRenderer()');

});