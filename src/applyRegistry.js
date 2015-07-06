/**
 * Created by rharik on 6/30/15.
 */

var Dependency = require('./Dependency');
var invariant = require('invariant');

module.exports = function(registry, graph) {
    invariant(registry, 'Must provide a registry');
    invariant(graph,'Must provide a graph');

    var resolveItem = function(graph,item){
        // this will get more complexe as features are added
        graph.addItem(item);
    };
    registry.dependencyDeclarations.forEach(x=> resolveItem(graph,x));
    registry.renamedDeclarations.forEach(x=> {
        var target = graph.findRequiredDependency(x.oldName,x.oldName);
        if(target) { target.name = x.name }
    });
};
