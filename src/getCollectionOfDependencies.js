/**
 * Created by parallels on 9/8/15.
 */

var groupDependencies = require('./groupDependencies');

var tryRequireDependency = function(dependencyName) {
    try {
        logger.trace('Graph | findItem: item NOT found, trying to require(dep)');
        var tryingRequire = require(dependencyName);
        logger.trace('Graph | findItem: trying to "require" ' + dependencyName);

        if (tryingRequire) {
            logger.trace('Graph | findItem: require found item');
            logger.trace('Graph | findItem: adding it to graph');
            return {name        : dependencyName,
                resolvedInstance: tryingRequire
            };
        }
    } catch (ex) {
        logger.info('Graph | findItem: item was not found and require threw an error');
        logger.info('Graph | findItem: error' + ex);
        //swallow, just a hail mary to resolve
    }
};

var findDependency = function(_items, dependencyName){
    invariant(dependencyName, 'You must provide a dependency name to find');
    for(let i of _items){
        logger.trace('Graph | findItem: '+dependencyName+' target :' + i.name);
        if(i.name === dependencyName){
            logger.trace('Graph | findItem: item found');
            return i;
        }
    }
};

module.exports = function(item, items, groupAsArray) {
    logger.trace('Dependency | getCollectionOfDependencies: getting args from wrapper function and finding instances in graph');
    var args = fnArgs(item.wrappedInstance);

    logger.trace('Dependency | getCollectionOfDependencies: args: ' + args);
    return args.map(d=> {
        var item = findDependency(items, d);
        if (!item) {
            item = groupDependencies(items, d, groupAsArray);
        } else if (!item) {
            item = tryRequireDependency(d)
        }
        if (!item) {
            logger.debug('Dependency | getCollectionOfDependencies: can not find dependency: ' + d);
            logger.debug('Dependency | getCollectionOfDependencies: ' + items.map(x=> x.name));
            invariant(false, 'Module ' + this.name + ' has a dependency that can not be resolved: ' + d);
        }
        // wouldn't I need to flatten this if there is a grouped dependency?
        return item;
    });
};
