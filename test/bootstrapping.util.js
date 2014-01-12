var assert = require("assert"),
molly = require('../lib/bootstrapping/util').molly,
_ = require('lodash');
/**
suite("molly", function() {

    test("extends", function() {
        var extend = molly.get('util.extends');
        var test = function(){};
        var parentFunction = function(){
            this.parentMessage = function(){
                return 'parentFunction';
            };
        };
        extend(test, parentFunction);
        extend(test, {
            hello: function(){
                return 'hello world';
            }
        });

        var obj = new test();
        assert.equal(obj instanceof test, true);
        assert.equal(obj instanceof parentFunction, true);
        assert.equal(obj.parentMessage(), 'parentFunction');
        assert.equal(obj.hello(), 'hello world');
    });

});
*/