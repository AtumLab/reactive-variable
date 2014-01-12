var _ = require('lodash');
var molly = require('./bootstrapping/util').molly;
require('./type/number');
require('./type/string');
require('./type/array');
require('./type/object');
require('./type/base');

molly.module('molly', function( module ){
    var Types = molly.get('type');

    var watch = function (f, type) {
        if( !_.isFunction(f) )
            throw new Error ('f must be function');
        if( _.isUndefined(type) )
            type = 'Base'; // default is 
        return new Types[type](f);
    };

    module.watch = watch;
});

exports.molly = molly;