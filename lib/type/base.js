var molly = require('../bootstrapping/util').molly,
_ = require('lodash');
require('../reactive/dependency');

var Dependency = molly.get('reactive.Dependency');
var Computation = molly.get('reactive.Computation');

molly.module('type', function( module ){

    var BaseModel = function (data) {
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

        this._computationList = {

        };
        this.stop = function(){
            var self = this;
            for (var id in self._computationList)
                self._computationList[id].stop();
        };

        this.watch = function(data){
            if( _.isFunction(data) ){
                var boundSet = _.bind(function(computation){
                    var result = data.call(this, computation);
                    if( !_.isUndefined(result) )
                        this.set(result);
                }, this);
                var _computation = new Computation(boundSet, this);
                this._computationList[_computation._id] = _computation;
            }
        };

        this.unwatch = function(linkOrNode){
            console.log(linkOrNode.getType(), 'linkOrNode');
            console.log('need to implement');
        };

        if( _.isFunction(data) ){
            this.watch(data); 
        }
        else if( !_.isUndefined(data) )
            this.set(data);
    };
    module.Base = BaseModel;

});

exports.molly = molly;