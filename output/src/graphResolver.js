/**
 * Created by rharik on 6/30/15.
 */

'use strict';

var logger = require('./logger');
var getDependenciesForItem = require('./getDependenciesForItem');
var resolveInstance = require('./resolveInstance');

//WARNING dependencyGraph is modified by reference!!

module.exports = function graphResolver(dependencyGraph) {

    var recurse = function recurse(items) {
        logger.trace('GraphResolver | recurse: beginning recursion');
        recurseTree(items);
    };

    var recurseTree = function recurseTree(items) {
        items.forEach(function (x) {
            var flattenedChildren = getDependenciesForItem.flatDependencyGraph(x, dependencyGraph);

            if (flattenedChildren.length > 0) {
                recurseTree(flattenedChildren);
            }
            logger.trace('GraphResolver | recurseTree: resolving instance of ' + x.name);
            resolveInstance(x, flattenedChildren, dependencyGraph);
        });
        return items;
    };

    return recurse(dependencyGraph);
};