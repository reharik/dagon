/**
 * Created by parallels on 9/10/15.
 */

var getDependency = require('./getDependency');
var logger = require('./logger');
var invariant = require('invariant');
var fnArgs = require('fn-args');
var R = require('ramda');


module.exports = function getDependenciesForItem(item, dependencyGraph) {
    var args         = fnArgs(item.wrappedInstance);
    var dependencies = args.map(d => getDependency.fullDependency(dependencyGraph, d));
    return R.flatten(dependencies);
};


