var expect = require('chai').expect;
var molly = require('../lib/type/string').molly;
require('../lib/type/variable');

var variable = molly.get('type.Variable');
/**
suite("string", function() {

    test("trim, split, join", function() {
        var string = variable('hello');

        string.set('  hello world  ');
        expect(string.trim()).to.equal('hello world');
        
        string.set('hello world');
        expect(string.split('').reverse().join('')).to.equal('dlrow olleh');
    });

    test("watch", function() {
        var string = variable('hello');

        string.set('  hello world  ');
        expect(string.trim()).to.equal('hello world');
        
        string.set('hello world');
        expect(string.split('').reverse().join('')).to.equal('dlrow olleh');
    });
});
*/