module('shims');
test('Object.keys', function() {

    // Object.keys shim
    ok(Object.keys, 'Object.keys exists');
    equal(typeof Object.keys, 'function', 'Object.keys is a function');
    var keys = ['a','b'],
        object = {
            a:'A',
            b:'B'
        };
    deepEqual(Object.keys(object), keys, 'Object.keys works =)');
});

test('hasOwnProperty', function() {

    // Object.prototype.hasOwnProperty shim
    ok(Object.prototype.hasOwnProperty, 'Object.prototype.hasOwnProperty exists');
    equal(typeof Object.prototype.hasOwnProperty, 'function', 'Object.prototype.hasOwnProperty is a function');
    var fn = function() {};
    fn.prototype.a = 'a';
    fn.b = 'b';

    equal(fn.hasOwnProperty('a'), false, 'hasOwnProperty on prototypical property');
    equal(fn.hasOwnProperty('b'), true, 'hasOwnProperty on static property');
});