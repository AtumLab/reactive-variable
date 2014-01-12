var _ = require('lodash');
var molly = require('../bootstrapping/util').molly;
require('./number');
require('./string');
require('./array');
require('./object');

molly.module('type', function( module ) {
    var Types = molly.get('type');
 
    var getBaseType = function(data) {
        if( _.isString(data) )
            return 'String';
        else if( _.isArray(data) )
            return 'Array';
        // it because _.isObject([function]) == true
        else if( _.isFunction(data) )
            return 'Base';
        else if( _.isObject(data) )
            return 'Object';
        else if( _.isNumber(data) )
            return 'Number';
        else
            return 'Base';
    };

    var Variable = function (data, type) {
        if(_.isUndefined(type))
            type = getBaseType(data);
        return new Types[type](data);
    };
    module.Variable = Variable;
});

exports.molly = molly;