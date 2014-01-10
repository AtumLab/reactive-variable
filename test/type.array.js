var expect = require('chai').expect;
var molly = require('../lib/type/array').molly;
require('../lib/type/variable');
require('../lib/watch');

var variable = molly.get('type.Variable');
var watch = molly.get('watch');

suite("array", function() {

    test("push, pop", function() {
        var array = variable([1, 2, 3]);
        expect(array.pop()).to.equal(3);
        array.push(9);
        expect(array.length()).to.equal(3);
    });

    test("watch, length, sort", function() {
        var array = variable([1, 2, 3]);
        var i = 0;
        watch(function(){
            i = array.length();
        });
        expect(i).to.equal(3);
        array.push(4);
        expect(i).to.equal(4);
        array.sort(function(a, b) {
            return a - b;
        });
        expect(array.get(1)).to.equal(2);
    });

    test("watch", function() {
        var array = variable([4, 2, 3]);
        var a = new variable(1);
        watch(function(){
            array.set(a.get(), 1);
        });
        expect(array.get(1)).to.equal(1);
        a.set(10);
        expect(array.get(1)).to.equal(10);
    });
});