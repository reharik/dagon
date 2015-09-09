/**
 * Created by parallels on 9/9/15.
 */
var groupDependencies = require('./groupDependencies');
var logger = require('./logger');
var invariant = require('invariant');


var tryRequireDependency = function(dependencyName) {
    try {
        logger.trace('getFlatCollectionOfDependencies | tryRequireDependency: item NOT found, trying to require(dep)');
        var tryingRequire = require(dependencyName);
        logger.trace('getFlatCollectionOfDependencies | tryRequireDependency: trying to "require" ' + dependencyName);

        if (tryingRequire) {
            logger.trace('getFlatCollectionOfDependencies | tryRequireDependency: require found item');
            logger.trace('getFlatCollectionOfDependencies | tryRequireDependency: adding it to graph');
            return {name        : dependencyName,
                resolvedInstance: tryingRequire
            };
        }
    } catch (ex) {
        logger.info('getFlatCollectionOfDependencies | tryRequireDependency: item was not found and require threw an error');
        logger.info('getFlatCollectionOfDependencies | tryRequireDependency: error' + ex);
        //swallow, just a hail mary to resolve
    }
};

var findDependency = function(_items, dependencyName){
    invariant(dependencyName, 'You must provide a dependency name to find');
    for(let i of _items){
        logger.trace('getFlatCollectionOfDependencies | findDependency: '+dependencyName+' target :' + i.name);
        if(i.name === dependencyName){
            logger.trace('getFlatCollectionOfDependencies | findDependency: item found');
            return i;
        }
    }
};

var getDependency = function getDependency(items, dependencyName){
    var item;
    item = findDependency(items, dependencyName);
    if(!item){
        item = groupDependencies(items, dependencyName);
    } else if(!item){
        item = tryRequireDependency(dependencyName);
    }
    if (!item) {
        logger.debug('Dependency | getFlatCollectionOfDependencies: can not find dependency: ' + d);
        logger.debug('Dependency | getFlatCollectionOfDependencies: ' + items.map(x=> x.name));
        invariant(false, 'Module ' + item.name + ' has a dependency that can not be resolved: ' + d);
    }
    return item;
};

module.exports = {
        fullDependency: function(items, dependencyName){ return getDependency(items, dependencyName); },
        resolvedInstance: function(items, dependencyName){
            var dependency = getDependency(items, dependencyName);
            if(Array.isArray(dependency)){
                var groupedDependency = [];
                for (let i of dependency) {
                    if (i.groupName == dependencyName) {
                        groupedDependency.push(i.resolvedInstance);
                    }
                }
                return groupedDependency;
            }
            return dependency.resolvedInstance;

        }
};
