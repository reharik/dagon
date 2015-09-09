/**
 * Created by rharik on 6/30/15.
 */

var logger = require('./logwrapper');
var getCollectionOfDependencies = require('./getCollectionOfDependencies');
var resolveInstance = require('./resolveInstance');

//WARNING dependencyGraph is modified by reference!!

module.exports = function(dependencyGraph){

    var flatten = function(array) {
        return Array.isArray(array) ? [].concat.apply([], array.map(x=>this.flatten(x))||[]) : array;
    };

    var recurse = function(items){
        logger.trace('GraphResolver | recurse: beginning recursion');
        recurseTree(items);
    };

    var recurseTree = function(items) {
        items.forEach(x=> {
            var children = flatten(getCollectionOfDependencies(x,items,true));
            if (children.length>0) {
                this.recurseTree(children);
            }
            resolveInstance(x, children);
        });
        return items;
    };

    return recurse(dependencyGraph);
};
