/**
 * Created by reharik on 12/13/15.
 */

var getDependency = require('./getDependency');


module.exports = function resolveDependenciesForItem(item, resolvedChildren) {
    var args = fnArgs(item.wrappedInstance);
    return args.map(d => getDependency(resolvedChildren, d));
};
