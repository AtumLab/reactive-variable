var _ = require('lodash');
var molly = require('../bootstrapping/util').molly;
require('./number');
require('./string');
require('./array');
require('./object');
/**
var ReactiveObject = require('./object');
*/

molly.module('type', function( module ) {
    var NumberModel = molly.get('type.Number');
    var StringModel = molly.get('type.String');
    var ArrayModel = molly.get('type.Array');
    var ObjectModel = molly.get('type.Object');
    var Variable = function (data) {
        if( _.isString(data) )
            return new StringModel(data);
        else if( _.isArray(data) )
            return new ArrayModel(data);
        else if( _.isObject(data) )
            return new ObjectModel(data);
        else if( _.isNumber(data) ){
            return new NumberModel(data);
        }
    };
    module.Variable = Variable;
});

exports.molly = molly;
