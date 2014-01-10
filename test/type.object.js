var expect = require('chai').expect;
var molly = require('../lib/type/object').molly;
require('../lib/type/variable');

var watch = molly.get('watch');
var variable = molly.get('type.Variable');

suite("object", function() {

    test("create, get, set", function() {
        var object = variable({
            firstName: 'hoang',
            lastName: 'le'
        });
        expect(object.get('firstName')).to.equal('hoang');
        expect(object.get('lastName')).to.equal('le');
        object.set('change', 'firstName');
        expect(object.get('firstName')).to.equal('change');
        object.set('change', 'lastName');
        expect(object.get('lastName')).to.equal('change');
    });

    test("toString", function() {
        var o = {
            firstName: 'hoang',
            lastName: 'le'
        };
        var object = variable(o);
        expect(object.stringify()).to.equal(JSON.stringify(o));
    });

    test("watch", function() {
        var object = variable({
            firstName: 'hoang',
            lastName: 'le'
        });
        var firstName;
        watch(function(){
            firstName = object.get('firstName');
        });
        expect(firstName).to.equal('hoang');
        object.set('change', 'firstName');
        expect(firstName).to.equal('change');
    });
});