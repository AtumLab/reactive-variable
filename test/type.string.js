var expect = require('chai').expect;
var molly = require('../lib/type/string').molly;
require('../lib/type/variable');

var variable = molly.get('type.Variable');
var watch = molly.get('watch');

suite("string", function() {

    test("trim, split, join", function() {
        var string = variable('hello');

        string.set('  hello world  ');
        expect(string.trim()).to.equal('hello world');
        
        string.set('hello world');
        expect(string.split('').reverse().join('')).to.equal('dlrow olleh');
    });

    test("watch", function() {
        var a = new variable('hello');
        var b = new variable('world');
        var c = watch(function (com) {
            return a.get() + b.get();
        }, 'String');

        expect(c.get()).to.equal('helloworld');
        b.set(3);
        expect(c.get()).to.equal('hello3');
        a.set(3);
        expect(c.get()).to.equal('33');
        c.stop();
        b.set(0);
        expect(c.get()).to.equal('33');
    });
});
