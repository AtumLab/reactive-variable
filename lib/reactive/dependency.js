var molly = require('../bootstrapping/namespace').molly;
var _ = require('lodash');

var active = false;
var currentComputation = null;
var setCurrentComputation = function (c) {
    currentComputation = c;
    active = !! c;
};
var getCurrentLink = function(){
    return currentComputation;
};

var inCompute = false;


/**
 * Pipeline
 *
 *
 */
(function(module){
    
    var _pipeline = [];
    
    var length;
    /**
     * @description It is true if we are in flushing function now
     * @type {boolean}
     */
    var inFlush = false;
    /**
     * @description It true if a flushing function is scheduled, or if we are in flushing now
     * @type {boolean}
     */
    var willFlush = false;
    var _type = 'Pipeline';

    Pipeline = {
        push: function(link){
            if(link.getType() !== "Link")
                throw new Error("param must be type of Link");
            _pipeline.push(link);
        },
        flushing: function(){
            inFlush = true;
            length = _pipeline.length;

            for (var i = 0; i < length; i++) {
                _pipeline[i]._recompute();
            }

            _pipeline = [];
            length = 0;
            inFlush = true;
        },

        // set
        willFlush: function( p ){
            willFlush = !!p;
        },
        inFlush: function( p ){
            inFlush = !!p;
        },

        // get
        isWillFlush: function(){
            return willFlush;
        },
        isInFlush: function(){
            return inFlush;
        },

        getType: function(){
            return _type;
        }
    };
    module['Pipeline'] = Pipeline;

})(molly.namespace('reactive'));

(function( module ){
    var id = 1;
    var nextId = function(){
        return id++;
    };
    var pipeline = null;
    var ensurePipeline = function(){
        if(!pipeline)
            pipeline = molly.get('reactive.Pipeline');
    };
    var Link = function (f, node) {
        if( !_.isFunction(f) )
            throw new Error ('f must be function');
        //if(node.getType() !== "Node")
            //throw new Error("param must be type of node");

        var self = this;
        // private property
        self._id = nextId();
        self._node = node;
        var _type = 'Link';
        this.getType = function(){
            return _type;
        };

        // public property
        self.stopped = false;
        self.invalidated = false;
        self.firstRun = true;

        // private
        self._onInvalidateCallbacks = [];
        self._parent = getCurrentLink();

        self._func = f;
        self._recomputing = false;

        var errored = true;
        try {
            self._compute();
            errored = false;
        } finally {
            self.firstRun = false;
            if (errored)
                self.stop();
        }
    };

    _.extend(Link.prototype, {

        constructor: Link,

        onInvalidate: function (f) {
            var self = this;

            if (typeof f !== 'function')
                throw new Error("onInvalidate requires a function");

            var g = _.bind(f, null, self);

            if (self.invalidated)
                g();
            else
                self._onInvalidateCallbacks.push(g);
        },

        invalidate: function () {
            var self = this;
            ensurePipeline();

            if (! self.invalidated) {
                self.invalidated = true;

                for(var i = 0, f; f = self._onInvalidateCallbacks[i]; i++)
                    f();
                self._onInvalidateCallbacks = [];

                if (! self._recomputing && ! self.stopped) {
                    //requireFlush();
                    //pendingComputations.push(this);
                    self._recompute();
                    pipeline.push(self);
                }
            }
        },

        stop: function () {
            if (! this.stopped) {
                this.stopped = true;
                this.invalidate();
            }
        },

        _compute: function () {
            var self = this;
            self.invalidated = false;

            var previous = currentComputation;
            setCurrentComputation(self);
            var previousInCompute = inCompute;
            inCompute = true;
            try {
                self._func(self);
            } finally {
                setCurrentComputation(previous);
                inCompute = false;
            }
        },

        _recompute: function () {
            var self = this;

            self._recomputing = true;
            while (self.invalidated && ! self.stopped) {
                try {
                    self._compute();
                } catch (e) {
                    console.log("Exception from recompute:", e.stack || e.message);
                }
            }
            self._recomputing = false;
        }
    });

    module.Computation = Link;

})(molly.namespace('reactive'));


/**
 *
 */
(function(module){

    var Dependency = function () {
        this._dependentsListById = {};

        var _type = 'DependentsList';
        this.getType = function(){
            return _type;
        };
    };
    _.extend(Dependency.prototype, {
        register: function (computation) {
            if (! computation) {
                if (! active)
                    return false;
                computation = currentComputation;
            }
            var self = this;
            var id = computation._id;
            if (! (id in self._dependentsListById)) {
                self._dependentsListById[id] = computation;
                return true;
            }
            return false;
        },

        notify: function () {
            var self = this;
            for (var id in self._dependentsListById)
                self._dependentsListById[id].invalidate();
        },

        hasRegister: function (id) {
            var self = this;
            if( !_.isUndefined(id) ){
                return !!self._dependentsListById[id];
            }
            for(var id in self._dependentsListById)
                return true;
            return false;
        }
    });

    module.Dependency = Dependency;

})(molly.namespace('reactive'));

/**
 *
 */
(function(module){
    module.getCurrentComputation = getCurrentLink;
})(molly.namespace('reactive'));