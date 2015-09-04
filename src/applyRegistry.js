/**
 * Created by rharik on 6/30/15.
 */

var invariant = require('invariant');

module.exports = function(registry, graph) {
    invariant(registry, 'Must provide a registry');
    invariant(graph,'Must provide a graph');

    var resolveItem = function(graph,item){
        // this will get more complexe as features are added
        graph.addItem(item);
    };
    registry.dependencyDeclarations.forEach(x=> {

        var target = graph.findRequiredDependency(x.name);
        if(target) {
            target.name = x.name ? x.name : target.name;
            target.path = x.path? x.path: target.path;
            target.instantiate = x.instantiate ? x.instantiate : target.instantiate;
        }else{
            x.path = x.path ? x.path : x.name;
            resolveItem(graph,new Dependency(x,logger));
        }
    });

    registry.renamedDeclarations.forEach(x=> {
        var target = graph.findRequiredDependency(x.oldName);
        if(target) { target.name = x.name}
    });
};
