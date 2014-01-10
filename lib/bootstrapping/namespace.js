// angular module
// http://docs.angularjs.org/api/angular.module
// http://jsbin.com/AVeFeKE/1/edit

/**
var VALID_KEYS = [
    'Number',
    'Object',
    'String',
    'Array',
    'Base'
];
*/

var molly = require('./_boot').molly,
_ = require('lodash');
var root = {};

molly.namespace = function ( ns_string ) {
    if( !_.isString(ns_string) )
        throw new Error('ns_string must be string');
    
    var parts = ns_string.split('.'),
    i, len = parts.length,
    parent = root;
    // strip redundant leading global
    if (parts[0] === 'molly') {
        parts = parts.slice(1);
        len -= 1;
    }
    for (i = 0; i < len; i += 1) {
        // create a property if it doesn't exist
        if (typeof parent[parts[i]] === "undefined") {
        	parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};

molly.module = function (namespace, func) {
    if( !_.isString(namespace) )
        throw new Error('namespace must be string');
    if( !_.isFunction(func) )
        throw new Error('func must be function');

    var m = this.namespace(namespace);
    func.apply(root, [m]);
    return m;
};

molly.get = function (namespace, context) {
    if( !_.isString(namespace) )
        throw new Error('namespace must be string');
    var func = this.namespace(namespace);

    if( !_.isUndefined(context) )
        return _.bind(func, context);
    return _.bind(func);
};

exports.molly = molly;