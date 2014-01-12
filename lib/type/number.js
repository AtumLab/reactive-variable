var _ = require('lodash');
var molly = require('../bootstrapping/util').molly;
require('./base');
require('../reactive/dependency');
require('../reactive/node');

var methods = [
    'toFixed'
];

var Dependency = molly.get('reactive.Dependency');
var Node = molly.get('reactive.Node');
var extend = molly.get('util.extends');

molly.module('type', function( module ) {
    
    var NumberModel = extend(function( data ){
        this._deps = new Dependency(this);
        this._value = null;
        
        this.makeRegister('get', function(){
            return this._value;
        });

        this.makeNotify('set', function(value){
            this._value = value;
        });

        //method
        var self = this;
        _.each(methods, function(v){
            self[v] = function () {
                var args = Array.prototype.slice.call(arguments);
                return self._value[v].apply(self._value, args);
            };
        });
        if( _.isFunction(data) ){
            this.watch(data);
        }
        else if( _.isNumber(data))
            this.set(data);
    }, Node);

    module.Number = NumberModel;
});

exports.molly = molly;