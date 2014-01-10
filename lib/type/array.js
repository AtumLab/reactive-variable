var _ = require('lodash');
var molly = require('../bootstrapping/util').molly;
require('./base');
require('../reactive/dependency');

var mutator = 'pop push reverse shift sort splice unshift'.split(" ");
var accessor = 'concat join slice toSource toString toLocaleString indexOf lastIndexOf'.split(" ");

var Dependency = molly.get('reactive.Dependency');
var Computation = molly.get('reactive.Computation');
var getCurrentComputation = molly.get('reactive.getCurrentComputation');
molly.module('type', function( module ) {
    var ArrayModel = function( data ){
        this._deps = new Dependency();

        this._value = null;
        this.get = function(index){
            if( _.isNumber(index) ) {
                this._deps.register();
                return this._value[index];
            }
            else if ( _.isUndefined(index) ) {
                this._deps.register();
                return this._value;
            }
        };
        this.set = function(value, index){
            if( _.isNumber(index) ) {
                this._value[index] = value;
                this._deps.notify();
            }
            else if ( _.isUndefined(index) && _.isArray(value)) {
                this._value = value;
                this._deps.notify();
            }
        };
        this.stop = function(){
            if(this._computation)
                this._computation.stop();
        };
        this._computation = null;

        //mutator methods
        var self = this;
        _.each(mutator, function(v){
            self[v] = function () {
                var args = Array.prototype.slice.call(arguments);
                var result = self._value[v].apply(self._value, args);
                self._deps.notify();
                return result;
            };
        });

        // accessor methods
        _.each(accessor, function(v){
            self[v] = function () {
                var args = Array.prototype.slice.call(arguments);
                var result = self._value[v].apply(self._value, args);
                self._deps.notify();
                return result;
            };
        });
        self['length'] = function () {
            self._deps.register();
            return self._value.length;
        };

        if( _.isFunction(data) ){
            var boundSet = _.bind(function(computation){
                var result = data.call(this, computation);
                if( _.isArray(result) )
                    this.set(result);
            }, this);
            this._computation = new Computation(boundSet, getCurrentComputation());
        }
        else if( _.isArray(data))
            this.set(data);
    };

    module.Array = ArrayModel;
});

exports.molly = molly;