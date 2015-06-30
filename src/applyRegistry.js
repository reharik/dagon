/**
 * Created by rharik on 6/30/15.
 */

var Dependency = require('./Dependency');

module.exports = function(registry, graph) {
    var resolveItem= function(graph,item){
        // this will get more complexe as features are added
        graph.addItem(new Dependecy(item.name, item.path));
    };
    registry.dependencyDeclarations.forEach(x=> resolveItem(graph,x));
    registry.renamedDeclarations.forEach(x=> {
        var target = graph.findDependency(x.oldName);
        if(target) { target.name = x.name }
    });
};
