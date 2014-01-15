var _ = require('lodash');
var molly = require('../bootstrapping/util').molly;
require('./base');
require('../reactive/dependency');
require('../reactive/node');

var Dependency = molly.get('reactive.Dependency');
var Node = molly.get('reactive.Node');
var extend = molly.get('util.extends');

var mutator = 'pop push reverse shift sort splice unshift'.split(" ");
var accessor = 'concat join slice toSource toString toLocaleString indexOf lastIndexOf'.split(" ");

molly.module('type', function( module ) {

    var ArrayModel = extend(function( data ){
        this._deps = new Dependency(this);
        this._value = null;

        this.makeRegister('get', function(index){
            if( _.isNumber(index) ) {
                return this._value[index];
            }
            else if ( _.isUndefined(index) ) {
                return this._value;
            }
        });

        this.makeNotify('set', function(value, index){
            if( _.isNumber(index) ) {
                this._value[index] = value;
            }
            else if ( _.isUndefined(index) && _.isArray(value)) {
                this._value = value;
            }
        });

        //mutator methods
        var self = this;
        _.each(mutator, function(v){
            self.makeNotify(v, function(){
                var args = Array.prototype.slice.call(arguments);
                var result = self._value[v].apply(self._value, args);
                return result;
            });
        });

        // accessor methods
        _.each(accessor, function(v){
            self.makeRegister(v, function(){
                var args = Array.prototype.slice.call(arguments);
                var result = self._value[v].apply(self._value, args);
                return result;
            });
        });

        self['length'] = function () {
            self._deps.register();
            return self._value.length;
        };

        if( _.isFunction(data) ){
            this.watch(data); 
        }
        else if( _.isArray(data) )
            this.set(data);
    }, Node);

    module.Array = ArrayModel;
});

exports.molly = molly;