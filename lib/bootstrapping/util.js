var molly = require('./namespace').molly,
_ = require('lodash');

molly.module('util', function( module ){
    module.extends = function (child, parent) {
        if(!_.isFunction(child))
            throw new Error('child must be function');
        if( _.isFunction(parent) ) {
            child.prototype = new parent();
            child.prototype.constructor = child;
        }
        else if( _.isObject(parent) ) {
            _.extend(child.prototype, parent);
        }
        return child;
    };
});

exports.molly = molly;