var molly = require('../bootstrapping/util').molly,
_ = require('lodash');
require('../reactive/dependency');

var Dependency = molly.get('reactive.Dependency');
molly.module('type', function( module ){

    var ReactiveBase = function (data) {
        this._deps = new Dependency();
        this._value = data;
        this.get = function(){
            this._deps.register();
            return this._value;
        };
        this.set = function(value){
            this._value = value;
            this._deps.notify();
        };
        this.stop = function(){
            
        };
    };
    module.ReactiveBase = ReactiveBase;

});

exports.molly = molly;