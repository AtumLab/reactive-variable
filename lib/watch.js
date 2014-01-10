var _ = require('lodash');
require('./reactive/dependency');
require('./type/number');
require('./type/base');

var NumberModel = molly.get('type.Number');
var BaseModel = molly.get('type.Base');

molly.module('molly', function( module ){
    var watch = function (f, type) {
        if( !_.isFunction(f) )
            throw new Error ('f must be function');
        if( _.isUndefined(type) )
            type = 'Base'; // default is 
        var c;
        switch (type) {
            case 'Number': c = new NumberModel(f);
                break;
            case 'Base': c = new BaseModel(f);
                break;
            default:
                break; 
        } 
        return c;
    };
    module.watch = watch;
});

exports.molly = molly;