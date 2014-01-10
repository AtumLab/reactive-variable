var _ = require('lodash');
require('./reactive/dependency');
require('./type/number');

var getCurrentComputation = molly.get('reactive.getCurrentComputation');
molly.module('molly', function( module ){
    var Number = molly.get('type.Number');
    var Computation = molly.get('reactive.Computation');
    var watch = function (f, type) {
        if( !_.isFunction(f) )
            throw new Error ('f must be function');
        if( _.isUndefined(type) )
            type = 'Computation'; // default is 
        var c;
        switch (type) {
            case 'Number': c = new Number(f);
                break;
            case 'Computation': c = new Computation(f, getCurrentComputation());
                break;
            default:
                break; 
        } 
        return c;
    };
    module.watch = watch;
});

exports.molly = molly;