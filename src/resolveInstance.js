/**
 * Created by parallels on 9/8/15.
 */

var instantiate = require('./instantiateInstance');
var logger = require('./logger');
var getFlatCollectionOfDependencies = require('./getFlatCollectionOfDependencies');
var getFinalResolvedDependencies = require('./getFinalResolvedDependencies');
var invariant = require('invariant');

module.exports = function(item, flattenedChildren, allItems){

    var getAllResolvedDependencies = function(_flattenedChildren){
        logger.trace('Dependency | getResolvedInstanceForCollectionOfDependencies: getting resolved instances recursively');
        var result = [];
        _flattenedChildren.forEach(x=> {
            result.push(resolveInstance(x, getFlatCollectionOfDependencies(x, allItems)));
        });
        return result;
    };

    var resolveInstance = function(item, _flattenedChildren) {
        if (item.resolvedInstance) {
            return item;
        }
        var resolvedChildren = getAllResolvedDependencies(_flattenedChildren);
        var resolvedDependencies = getFinalResolvedDependencies(item, resolvedChildren);
        item.resolvedInstance = instantiate(item, resolvedDependencies);

        invariant(item.resolvedInstance, 'Dagon was not able to resolve item: '+ item.name);
        return item;
    };

    return resolveInstance(item, flattenedChildren);
};
