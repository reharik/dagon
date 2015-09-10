/**
 * Created by parallels on 9/8/15.
 */

var instantiate = require('./instantiateInstance');
var logger = require('./logger');
var getFlatCollectionOfDependencies = require('./getFlatCollectionOfDependencies');
var getFinalResolvedDependencies = require('./getFinalResolvedDependencies');
var invariant = require('invariant');

module.exports = function resolveInstance(item, flattenedChildren, dependencyGraph){

    var getAllResolvedDependencies = function(_flattenedChildren){
        logger.trace('resolveInstance | getResolvedInstanceForCollectionOfDependencies: getting resolved instances recursively');
        var result = [];
        _flattenedChildren.forEach(x=> {
            result.push(resolveInstance(x, getFlatCollectionOfDependencies(x, dependencyGraph)));
        });
        return result;
    };

    var attemptToResolveInstance = function(item, _flattenedChildren) {
        if (item.resolvedInstance) {
            logger.trace('resolveInstance | attemptToResolveInstance : item ' + item.name + ' already resolved.');
            return item;
        }
        logger.trace('resolveInstance | attemptToResolveInstance : Get all resolved children.');
        var resolvedChildren = getAllResolvedDependencies(_flattenedChildren);

        logger.trace('resolveInstance | attemptToResolveInstance : Get all dependencies in there unwrapped state.');
        var resolvedDependencies = getFinalResolvedDependencies(item, resolvedChildren);

        logger.trace('resolveInstance | attemptToResolveInstance : Instantiate item with resolved dependencies.');
        item.resolvedInstance = instantiate(item, resolvedDependencies);

        invariant(item.resolvedInstance, 'Dagon was not able to resolve item: '+ item.name);
        return item;
    };

    return attemptToResolveInstance(item, flattenedChildren);
};
