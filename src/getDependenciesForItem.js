/**
 * Created by parallels on 9/10/15.
 */

var getDependency = require('./getDependency');
var logger = require('./logger');
var invariant = require('invariant');
var fnArgs = require('fn-args');

var flatten = function(array) {
    return Array.isArray(array) ? [].concat.apply([], array.map(x=>flatten(x)) || []) : array;
};

var resolvedItemsGraph = function resolvedItemsGraph(item, items) {
    invariant(item, 'resolvedItemsGraph requires an item to get dependencies for.');
    invariant(items, 'resolvedItemsGraph requires a collection of items to query for dependencies.');
    logger.trace('getDependenciesForItem | resolvedItemsGraph: getting args from wrapper function and finding instances in graph');
    var args = fnArgs(item.wrappedInstance);
    logger.trace('getDependenciesForItem | resolvedItemsGraph: args: ' + args);
    return args.map(d => {
        var found = getDependency.resolvedInstance(items, d);
        invariant(found, 'Module ' + item.name + ' has a dependency that can not be resolved: ' + d);
        return found;
    });

};

var flatDependencyGraph = function flatDependencyGraph(item, items) {
    invariant(item, 'flatDependencyGraph requires an item to get dependencies for.');
    invariant(items, 'flatDependencyGraph requires a collection of items to query for dependencies.');
    logger.trace('getDependenciesForItem | flatDependencyGraph: getting args from wrapper function of '+item.name+' and finding instances in graph');
    var args         = fnArgs(item.wrappedInstance);
    logger.trace('getDependenciesForItem | flatDependencyGraph: args: ' + args);
    var dependencies = args.map(d => {
        var found = getDependency.fullDependency(items, d);
        invariant(found, 'Module ' + item.name + ' has a dependency that can not be resolved: ' + d);
        return found;
    });
    return flatten(dependencies);
};


module.exports = {
    flatDependencyGraph:flatDependencyGraph,
    resolvedItemsGraph:resolvedItemsGraph
};
