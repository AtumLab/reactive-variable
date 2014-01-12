var _ = require('lodash');
var molly = require('../bootstrapping/util').molly;
require('./base');
require('../reactive/dependency');
require('../reactive/node');

var Dependency = molly.get('reactive.Dependency');
var Node = molly.get('reactive.Node');
var extend = molly.get('util.extends');


molly.module('type', function( module ){

    var BaseModel = extend(function( data ){
        this._deps = new Dependency(this);
        this._value = null;
        
        this.makeRegister('get', function(){
            return this._value;
        });

        this.makeNotify('set', function(value){
            this._value = value;
        });

        if( _.isFunction(data) ){
            this.watch(data); 
        }
        else if( !_.isUndefined(data) )
            this.set(data);
    }, Node);

    module.Base = BaseModel;

});

exports.molly = molly;