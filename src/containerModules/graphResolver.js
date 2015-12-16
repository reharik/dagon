/**
 * Created by rharik on 6/30/15.
 */

var logger = require('./../logger');
var getDependenciesForItem = require('./getDependenciesForItem');
var resolveInstance = require('./resolveInstance');

//WARNING dependencyGraph is modified by reference!!

module.exports = function graphResolver(dependencyGraph){

    var recurse = function(items){
        recurseTree(items);
    };

    var recurseTree = function(items) {
        items.forEach(item=> {
            var dependenciesForItem = getDependenciesForItem(item, items);

            if (dependenciesForItem.length>0) {
                recurseTree(dependenciesForItem);
            }
            resolveInstance(item, dependenciesForItem, items);
        });
        return items;
    };

    return recurse(dependencyGraph);
};
