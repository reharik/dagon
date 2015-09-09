/**
 * Created by rharik on 6/30/15.
 */

var logger = require('./logger');
var getFlatCollectionOfDependencies = require('./getFlatCollectionOfDependencies');
var resolveInstance = require('./resolveInstance');

//WARNING dependencyGraph is modified by reference!!

module.exports = function(dependencyGraph){

    var recurse = function(items){
        logger.trace('GraphResolver | recurse: beginning recursion');
        recurseTree(items);
    };

    var recurseTree = function(items) {
        items.forEach(x=> {
            var flattenedChildren = getFlatCollectionOfDependencies(x, dependencyGraph);
            if (flattenedChildren.length>0) {
                recurseTree(flattenedChildren);
            }

            resolveInstance(x, flattenedChildren, dependencyGraph);
        });
        return items;
    };

    return recurse(dependencyGraph);
};
