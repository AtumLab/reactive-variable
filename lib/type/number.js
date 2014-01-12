var _ = require('lodash');
var molly = require('../bootstrapping/util').molly;
require('./base');
require('../reactive/dependency');

var methods = [
    'toFixed'
];

var Dependency = molly.get('reactive.Dependency');
var Computation = molly.get('reactive.Computation');

molly.module('type', function( module ) {

    var NumberModel = function (data) {
        var _type = 'Node';
        this.getType = function(){
            return _type;
        };

        this._deps = new Dependency();

        this._value = null;
        this.get = function(){
            this._deps.register();
            return this._value;
        };
        this.set = function(value){
            this._value = value;
            this._deps.notify();
        };
        this.stop = function(){
            if(this._computation)
                this._computation.stop();
        };
        this._computation = null;
        //method
        var self = this;
        _.each(methods, function(v){
            self[v] = function () {
                var args = Array.prototype.slice.call(arguments);
                return self._value[v].apply(self._value, args);
            };
        });

        if( _.isFunction(data) ){
            /**
             * 
             */
            var boundSet = _.bind(function(computation){
                var result = data.call(this, computation);
                if( _.isNumber(result) )
                    this.set(result);
            }, this);
            this._computation = new Computation(boundSet, self);
        }
        else if( _.isNumber(data))
            this.set(data);
    };
    module.Number = NumberModel;
});

exports.molly = molly;