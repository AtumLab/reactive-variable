var molly = require('../bootstrapping/namespace').molly;
var _ = require('lodash');

var id = 1;
var nextId = function(){
    return id++;
};

var active = false;
var currentComputation = null;
var setCurrentComputation = function (c) {
    currentComputation = c;
    active = !! c;
}; 

var inCompute = false;

molly.module('reactive', function( module ){

    var Computation = function (f, parent) {
        
        var self = this;
        // public
        self.stopped = false;
        self.invalidated = false;
        self.firstRun = true;

        // private
        self._id = nextId();
        self._onInvalidateCallbacks = [];
        self._parent = parent;
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

    _.extend(Computation.prototype, {

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

            if (! self.invalidated) {
                self.invalidated = true;

                for(var i = 0, f; f = self._onInvalidateCallbacks[i]; i++)
                    f();
                self._onInvalidateCallbacks = [];

                if (! self._recomputing && ! self.stopped) {
                    //requireFlush();
                    //pendingComputations.push(this);
                    self._recompute();
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
                    console.log("Exception from Deps recompute:", e.stack || e.message);
                }
                // If _compute() invalidated us, we run again immediately.
                // A computation that invalidates itself indefinitely is an
                // infinite loop, of course.
                //
                // We could put an iteration counter here and catch run-away
                // loops.
            }
            self._recomputing = false;
        }
    });

    var Dependency = function () {
        this._dependentsListById = {};
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
                computation.onInvalidate(function () {
                    //delete self._dependentsListById[id];
                });
                return true;
            }
            return false;
        },

        notify: function () {
            var self = this;
            for (var id in self._dependentsListById)
                self._dependentsListById[id].invalidate();
        },

        hasRegister: function () {
            var self = this;
            for(var id in self._dependentsListById)
                return true;
            return false;
        }
    });
    module.getCurrentComputation = function(){
        return currentComputation;
    };
    module.Computation = Computation;
    module.Dependency = Dependency;
});

exports.molly = molly;