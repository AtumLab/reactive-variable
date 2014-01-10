var _ = require('lodash');
var molly = require('../bootstrapping/util').molly;
require('./base');
require('../reactive/dependency');

var methods = [
    'quote', 'substring', 'toLowerCase', 'toUpperCase', 'charAt',
    'charCodeAt', 'indexOf', 'lastIndexOf', 'startsWith', 'endsWith',
    'trim', 'trimLeft', 'trimRight', 'toLocaleLowerCase',
    'toLocaleUpperCase', 'localeCompare', 'match', 'search',
    'replace', 'split', 'substr', 'concat', 'slice'
];

var Dependency = molly.get('reactive.Dependency');
var Computation = molly.get('reactive.Computation');
var getCurrentComputation = molly.get('reactive.getCurrentComputation');
molly.module('type', function( module ) {

    var StringModel = function (data) {
        this._deps = new Dependency();

        this._value = null;
        this.get = function(){
            this._deps.register();
            return this._value;
        };
        this.set = function(value){
            if( _.isString(value) ){
                this._value = value;
                this._deps.notify();
            }
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
                if( _.isString(result) )
                    this.set(result);
            }, this);
            this._computation = new Computation(boundSet, getCurrentComputation());
        }
        else if( _.isString(data))
            this.set(data);
    };
    module.String = StringModel;
});

exports.molly = molly;