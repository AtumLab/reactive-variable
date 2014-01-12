var molly = require('../bootstrapping/namespace').molly;
var _ = require('lodash');

/**
 * Node
 *
 *
 */
var Dependency = molly.get('reactive.Dependency');
var Computation = molly.get('reactive.Computation');

(function(module){

    var Node = function(){

        var _type = 'Node';
        this.getType = function(){
            return _type;
        };

        this._computationList = {};
        this.stop = function(){
            var self = this;
            for (var id in self._computationList)
                self._computationList[id].stop();
        };

        this.watch = function(data){
            if( _.isFunction(data) ){
                var boundSet = this.bind(function(computation){
                    var result = data.call(this, computation);
                    if( !_.isUndefined(result) )
                        this.set(result);
                });
                var _computation = new Computation(boundSet, this);
                this._computationList[_computation._id] = _computation;
                return true;
            }
            return false;
        };

        this.unwatch = function(linkOrNode){
            console.log(linkOrNode.getType(), 'linkOrNode');
            console.log('need to implement');
        };

        this.makeRegister = function(name, func){
            if( !_.isString(name) )
                throw new Error ('name must be string');
            if( !_.isFunction(func) )
                throw new Error ('func must be function');
            
            this[name] = this.bind(function(){
                this._deps.register();
                var args = Array.prototype.slice.call(arguments);
                return func.apply(this, args);
            });
        };
        this.makeNotify = function(name, func) {
            if( !_.isString(name) )
                throw new Error ('name must be string');
            if( !_.isFunction(func) )
                throw new Error ('func must be function');

            this[name] = this.bind(function(){
                var args = Array.prototype.slice.call(arguments);
                func.apply(this, args);
                this._deps.notify();
            });
        };

        /*
         * 
         [node].bind(function(){}, 'arg1', 'arg2');
         */
        this.bind = function( func ){
            if( !_.isFunction(func) )
                throw new Error ('func must be function');
            var args = Array.prototype.slice.call(arguments, 1);
            args.unshift(this);
            args.unshift(func);
            return _.bind.apply(_, args);  
        };
    };

    module['Node'] = Node;

})(molly.namespace('reactive'));