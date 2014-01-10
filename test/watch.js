var expect = require('chai').expect,
molly = require('../lib/watch').molly,
_ = require('lodash');
require('../lib/type/variable');

var watch = molly.get('watch');
var variable = molly.get('type.Variable');

suite("watch", function() {

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

    test("with loop", function() {

        var a = new variable(0);
        var r = 0;
        var c = watch(function (c) {
            var r = a.get() + (0 | this._value);
            if (r > 23)
                c.stop();
            this._value = r;
        }, 'Number');
        expect(c.get()).to.equal(0); // 0 + 0
        for(var i = 1; i < 10; i++)
            a.set(i);
        expect(c.get()).to.equal(28); // 0 + 1 + 2 + 3 + 4 + 5 + 6 + 7
    });

    test("with string", function() {

        var string = variable('hello');
        var array = [ 'hello', 'how', 'are', 'you',
            'im', 'js'];
        var i = 0;

        watch(function(c){
            expect(string.get()).to.equal(array[i]);
        });
        _.each(array, function(v){
            string.set(v);
            i++;
        });
        expect(i).to.equal(array.length);
    });
});