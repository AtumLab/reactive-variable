var _ = require('lodash');
var molly = require('../bootstrapping/util').molly;
require('./base');
require('../reactive/dependency');

var Dependency = molly.get('reactive.Dependency');
var Computation = molly.get('reactive.Computation');

molly.module('type', function( module ) {
    var ObjectModel = function( data ){
        var _type = 'Node';
        this.getType = function(){
            return _type;
        };

        this._deps = new Dependency();

        this._value = null;
        this.get = function(index){
            if( !_.isUndefined(index) ) {
                this._deps.register();
                return this._value[index];
            }
            else if ( _.isUndefined(index) ) {
                this._deps.register();
                return this._value;
            }
        };
        this.set = function(value, index){
            if( !_.isUndefined(index) ) {
                this._value[index] = value;
                this._deps.notify();
            }
            else if ( _.isUndefined(index) && _.isObject(value)) {
                this._value = value;
                this._deps.notify();
            }
        };
        this.stop = function(){
            if(this._computation)
                this._computation.stop();
        };
        this._computation = null;

        this['stringify'] = function(){
            return JSON.stringify(this._value);
        };

        if( _.isFunction(data) ){
            var boundSet = _.bind(function(computation){
                var result = data.call(this, computation);
                if( _.isObject(result) )
                    this.set(result);
            }, this);
            this._computation = new Computation(boundSet, self);
        }
        else if( _.isObject(data))
            this.set(data);
    };

    module.Object = ObjectModel;
});

exports.molly = molly;