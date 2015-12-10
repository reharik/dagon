/**
 * Created by parallels on 9/9/15.
 */
var groupDependencies = require('./groupDependencies');
var logger = require('./logger');
var invariant = require('invariant');

var tryRequireDependency = function(dependencyName) {
    try {
        var tryingRequire = require(dependencyName);
        if (tryingRequire) {
            logger.trace('getDependency | tryRequireDependency: require found item');
            logger.trace('getDependency | tryRequireDependency: adding it to graph');
            return {name        : dependencyName,
                resolvedInstance: tryingRequire,
                wrappedInstance: function() { return tryingRequire; }
            };
        }
    } catch (ex) {
        logger.info('getDependency | tryRequireDependency: item was not found and require threw an error');
        logger.info('getDependency | tryRequireDependency: error' + ex);
        //swallow, just a hail mary to resolve
    }
};

var findDependency = function(_items, dependencyName){
    for(let i of _items){
        logger.trace('getDependency | findDependency: '+dependencyName+' target :' + i.name);
        if(i.name === dependencyName){
            logger.trace('getDependency | findDependency: item found '+dependencyName);
            return i;
        }
    }
};

var fullDependency = function fullDependency(dependencyGraph, dependencyName) {
    invariant(dependencyGraph, 'You must provide a a collection of dependencies to query');
    invariant(dependencyName, 'You must provide a dependency name to find');
    var item;
    logger.trace('getDependency | fullDependency: Trying to find the dependency : ' + dependencyName);
    item = findDependency(dependencyGraph, dependencyName);
    if (!item) {
        logger.trace('getDependency | fullDependency: Single dependency not found. Trying to build grouped dependency : ' + dependencyName);
        item = groupDependencies(dependencyGraph, dependencyName);
    }
    if (!item) {
        logger.trace('getDependency | fullDependency: Grouped dependency not found.  Trying to require dependency: ' + dependencyName);
        item = tryRequireDependency(dependencyName);
    }
    return item;
};

var resolvedInstance = function(dependencyGraph, dependencyName){
    var dependency = fullDependency(dependencyGraph, dependencyName);
    if(Array.isArray(dependency)){
        var groupedDependency = [];
        for (let i of dependency) {
            if (i.groupName == dependencyName) {
                groupedDependency.push(i.resolvedInstance);
            }
        }
        return groupedDependency;
    }
    return dependency ? dependency.resolvedInstance :undefined;
};

module.exports = {
        fullDependency: fullDependency,
        resolvedInstance: resolvedInstance
};
