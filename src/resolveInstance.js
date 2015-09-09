/**
 * Created by parallels on 9/8/15.
 */

var instantiate = require('./instantiateInstance');
var logger = require('./logwrapper');
var getCollectionOfDependencies = require('./getCollectionOfDependencies');

module.exports = function(item, itemsDependencies, allItems){

    var getResolvedDependencies = function(itemsDependencies){
        logger.trace('Dependency | getResolvedInstanceForCollectionOfDependencies: getting resolved instances recursively');
        var result = [];
        itemsDependencies.forEach(x=> {
            if (Array.isArray(x)) {
                result.push(getResolvedDependencies(x));
            }
            else{
                result.push(resolveInstance(x, getCollectionOfDependencies(x, allItems. true)));
            }
        });
        return result;
    };


    var resolveInstance = function(item, itemsDependencies) {
        if (item.resolvedInstance) {
            return item;
        }

        var resolvedDependencies = getResolvedDependencies(itemsDependencies);
        item.resolvedInstance = instantiate(item, resolvedDependencies);

        return item;
    };

    return resolveInstance(item, itemsDependencies);
};
