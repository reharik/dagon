/**
 * Created by reharik on 12/12/15.
 */


module.exports = function resolvedItemsGraph(item, resolvedChildren) {
    var args = fnArgs(item.wrappedInstance);
    return args.map(d => getDependency.resolvedInstance(resolvedChildren, d));

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

