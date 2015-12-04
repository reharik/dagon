/**
 * Created by reharik on 12/3/15.
 */
var invariant = require('invariant');
var logger = require('./logger');
var _ = require('lodash');

module.exports = function wrapInstances(item) {
        logger.trace('buildListOfDependencies | wrapInstance: Wrapping module ' + item.name + ' requiring item using path ' + item.path + '.');
        item.wrappedInstance = item.internal
            ? require(item.path)
            : function() {
            return require(item.path);
        };

        invariant(_.isFunction(item.wrappedInstance),
            'The following dependency: ' + item.name + ' at this path: ' + item.path + ' is not a function');

    return item;
};