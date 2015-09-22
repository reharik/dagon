/**
 * Created by parallels on 9/8/15.
 */

'use strict';

var instantiateInstance = require('./instantiateInstance');
var logger = require('./logger');
var getDependenciesForItem = require('./getDependenciesForItem');
var invariant = require('invariant');

module.exports = function resolveInstance(item, flattenedChildren, dependencyGraph) {

    var getAllResolvedDependencies = function getAllResolvedDependencies(_flattenedChildren) {
        logger.trace('resolveInstance | getResolvedInstanceForCollectionOfDependencies: getting resolved instances recursively');
        var result = [];
        _flattenedChildren.forEach(function (x) {
            result.push(resolveInstance(x, getDependenciesForItem.flatDependencyGraph(x, dependencyGraph)));
        });
        return result;
    };

    var attemptToResolveInstance = function attemptToResolveInstance(item, _flattenedChildren) {
        if (item.resolvedInstance) {
            logger.trace('resolveInstance | attemptToResolveInstance : item ' + item.name + ' already resolved.');
            return item;
        }
        logger.trace('resolveInstance | attemptToResolveInstance : Get all resolved children.');
        var resolvedChildren = getAllResolvedDependencies(_flattenedChildren);

        logger.trace('resolveInstance | attemptToResolveInstance : Get all dependencies in their unwrapped state.');
        var resolvedDependencies = getDependenciesForItem.resolvedItemsGraph(item, resolvedChildren);

        logger.trace('resolveInstance | attemptToResolveInstance : Instantiate item with resolved dependencies.');
        item.resolvedInstance = instantiateInstance(item, resolvedDependencies);

        invariant(item.resolvedInstance, 'Dagon was not able to resolve item: ' + item.name);
        return item;
    };

    return attemptToResolveInstance(item, flattenedChildren);
};