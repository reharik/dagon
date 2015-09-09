/**
 * Created by parallels on 9/8/15.
 */

var logger = require('./logger');
var fnArgs = require('fn-args');
var invariant = require('invariant');
var getDependency = require('./getDependency');

var flatten = function(array) {
    return Array.isArray(array) ? [].concat.apply([], array.map(x=>flatten(x))||[]) : array;
};

module.exports = function getFlatCollectionOfDependencies(item, items) {
    logger.trace('getFlatCollectionOfDependencies | constructor: getting args from wrapper function and finding instances in graph');
    var args = fnArgs(item.wrappedInstance);
    logger.trace('getFlatCollectionOfDependencies | constructor: args: ' + args);
    var dependencies = args.map( d => getDependency.fullDependency(items, d) );
    return flatten(dependencies);
};
