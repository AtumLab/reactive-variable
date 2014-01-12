var expect = require('chai').expect;
var molly = require('../lib/type/number').molly;
require('../lib/type/variable');

var variable = molly.get('type.Variable');
var watch = molly.get('watch');

suite("number", function() { 
	
	test("toFixed", function() {
        var number = variable(12345.6789);
        expect(number.toFixed(1)).to.equal('12345.7');
    });

    test("with number", function() {
        var a = new variable(1);
        var b = new variable(2);
        var c = watch(function (com) {
            return a.get() + b.get();
        }, 'Number');

        expect(c.get()).to.equal(3); // 3
        b.set(3);
        expect(c.get()).to.equal(4); // 4
        a.set(3);
        expect(c.get()).to.equal(6); // 6
        c.stop();
        b.set(0);
        expect(c.get()).to.equal(6); // not 1
    });

    test("with nested run", function() {

        var a = new variable(1);
        var b = new variable(2);
        var c = watch(function () {
            return a.get() + b.get();
        }, 'Number');
        var d = watch(function () {
            return 3 + c.get();
        }, 'Number');
        expect(c.get()).to.equal(3); // 1 + 2
        expect(d.get()).to.equal(6); // 3 + 3

        b.set(9);
        expect(c.get()).to.equal(10); // 1 + 9
        expect(d.get()).to.equal(13); // 10 + 3
        
        c.stop();
        b.set(20);
        expect(c.get()).to.equal(10);
        expect(d.get()).to.equal(13);
    });

});
