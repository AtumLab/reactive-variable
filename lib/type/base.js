var molly = require('../bootstrapping/util').molly,
_ = require('lodash');
require('../reactive/dependency');

var Dependency = molly.get('reactive.Dependency');
var Computation = molly.get('reactive.Computation');
var getCurrentComputation = molly.get('reactive.getCurrentComputation');

molly.module('type', function( module ){

    var BaseModel = function (data) {
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

        if( _.isFunction(data) ){
            var boundSet = _.bind(function(computation){
                var result = data.call(this, computation);
                if( !_.isUndefined(result) )
                    this.set(result);
            }, this);
            this._computation = new Computation(boundSet, getCurrentComputation());
        }
        else if( !_.isUndefined(data) )
            this.set(data);
    };
    module.Base = BaseModel;

});

exports.molly = molly;