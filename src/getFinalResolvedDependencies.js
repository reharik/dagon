/**
 * Created by parallels on 9/9/15.
 */

/**
 * Created by parallels on 9/8/15.
 */

var logger = require('./logger');
var fnArgs = require('fn-args');
var invariant = require('invariant');
var getDependency = require('./getDependency');

module.exports = function getFinalResolvedDependencies(item, items, groupAsArray) {
    logger.trace('getFinalResolvedCollectionOfDependency | constructor: getting args from wrapper function and finding instances in graph');
    var args = fnArgs(item.wrappedInstance);
    logger.trace('getFinalResolvedCollectionOfDependency | constructor: args: ' + args);
    return args.map( d => getDependency.resolvedInstance(items, d, groupAsArray) );
};
