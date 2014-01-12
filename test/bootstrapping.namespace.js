var assert = require("assert"),
molly = require('../lib/bootstrapping/namespace').molly,
_ = require('lodash');
/**
suite("molly", function() {

    test("specification", function() {
        assert.equal(molly.VERSION, "0.1");
    });

    test("namespace", function() {
        var test = molly.namespace('path.of.test');
        test.i = 0;
        assert.equal(0, molly.namespace('path.of.test').i);
    });

    test("module", function() {
        var test = molly.module('path.of.test', function( module ){
            module.hello = function () {
                return 'hello';
            };
        });
        assert.equal('hello', test.hello());
    });

});
*/