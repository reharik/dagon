/**
 * Created by parallels on 9/8/15.
 */
var invariant = require('invariant');

module.exports = function(graph, logger) {
    invariant(graph,'Must provide a graph');

    return graph.map(x=>{
        logger.trace('wrapDependency | wrapDependency: module '+x.name+' so requiring item using path '+x.path+'.');
        x.wrappedInstance = x.internal
            ? require(x.path)
            : function() { require(x.path); };
        invariant(_.isFunction(x.wrappedInstance),
            'wrapDependency | wrapDependency: dagon is unable to require the following dependency: '+x.name+' at this path: '+ x.path);
        return x;
    });
};
