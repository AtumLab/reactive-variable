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

        this._computationList = {

        };
        this.stop = function(){
            var self = this;
            for (var id in self._computationList)
                self._computationList[id].stop();
        };

        this._computation = null;

        if( _.isFunction(data) ){
            var boundSet = _.bind(function(computation){
                var result = data.call(this, computation);
                if( !_.isUndefined(result) )
                    this.set(result);
            }, this);
            var _computation = new Computation(boundSet, getCurrentComputation());
            this._computationList[_computation._id] = _computation;
        }
        else if( !_.isUndefined(data) )
            this.set(data);

        this.watch = function(data){
            if( _.isFunction(data) ){
                var boundSet = _.bind(function(computation){
                    var result = data.call(this, computation);
                    if( !_.isUndefined(result) )
                        this.set(result);
                }, this);
                var _computation = new Computation(boundSet, getCurrentComputation());
                this._computationList[_computation._id] = _computation;
            }
        };
    };
    module.Base = BaseModel;

});

exports.molly = molly;