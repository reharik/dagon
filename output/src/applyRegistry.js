/**
 * Created by rharik on 6/30/15.
 */

'use strict';

var invariant = require('invariant');
var Dependency = require('./Dependency');

module.exports = function (registry, graph, logger) {
    invariant(registry, 'Must provide a registry');
    invariant(graph, 'Must provide a graph');

    var resolveItem = function resolveItem(graph, item) {
        // this will get more complexe as features are added
        graph.addItem(item);
    };
    registry.dependencyDeclarations.forEach(function (x) {

        var target = graph.findRequiredDependency(x.name);
        if (target) {
            target.name = x.newName ? x.newName : target.name;
            target.path = x.path ? x.path : target.path;
            target.instantiate = x.instantiate ? x.instantiate : target.instantiate;
        } else {
            x.path = x.path ? x.path : x.name;
            resolveItem(graph, new Dependency(x, logger));
        }
    });
};