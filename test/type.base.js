var expect = require('chai').expect;
var _ = require('lodash');
var molly = require('../lib/type/base').molly;
require('../lib/type/variable');

var variable = molly.get('type.Variable');

suite("base", function() { 

    test("create, function", function() {
        var base = variable();
        expect(base.get()).to.equal(null);
        var func = variable(function(){
            if( _.isNumber(base.get()) ){
                return base.get() * 2;
            }
        });
        base.set('string');
        expect(func.get()).to.equal(null);
        base.set(10);
        expect(func.get()).to.equal(20);
    });

});