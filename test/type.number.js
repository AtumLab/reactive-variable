var expect = require('chai').expect;
var molly = require('../lib/type/number').molly;
require('../lib/type/variable');

var variable = molly.get('type.Variable');

suite("number", function() { 

    test("toFixed", function() {
        var number = variable(12345.6789);
        expect(number.toFixed(1)).to.equal('12345.7');
    });

});
