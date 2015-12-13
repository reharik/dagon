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
            return {
                name            : dependencyName,
                resolvedInstance: tryingRequire,
                wrappedInstance : function() { return tryingRequire; }
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
        if(i.name === dependencyName){
            return i;
        }
    }
};

module.exports = function getDependency(dependencyGraph, dependencyName) {
    var item = findDependency(dependencyGraph, dependencyName);
    if (!item) {
        item = groupDependencies(dependencyGraph, dependencyName);
    }
    if (!item) {
        item = tryRequireDependency(dependencyName);
    }
    return item;
};
