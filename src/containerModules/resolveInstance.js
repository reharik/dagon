/**
 * Created by parallels on 9/8/15.
 */

var instantiateInstance = require('./instantiateInstance');
var logger = require('./../logger');
var getDependenciesForItem = require('./getDependenciesForItem');
var resolveDependenciesForItem = require('./resolveDependenciesForItem');
var invariant = require('invariant');

module.exports = function resolveInstance(item, flattenedChildren, dependencyGraph){

    //var getDependenciesForChildren = function(_flattenedChildren){
    //    var result = [];
    //    _flattenedChildren.forEach(x=> {
    //        result.push(resolveInstance(x, getDependenciesForItem(x, dependencyGraph)));
    //    });
    //    return result;
    //};

    var attemptToResolveInstance = function(item, _flattenedChildren) {
        if (item.resolvedInstance) {
            return item;
        }
        var resolvedChildren = getDependenciesForChildren(_flattenedChildren);
        var resolvedDependencies = resolveDependenciesForItem(item, resolvedChildren);
        item.resolvedInstance = instantiateInstance(item, resolvedDependencies);
        return item;
    };

    return attemptToResolveInstance(item, flattenedChildren);
};
