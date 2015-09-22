/**
 * Created by parallels on 9/9/15.
 */
'use strict';

var groupDependencies = require('./groupDependencies');
var logger = require('./logger');
var invariant = require('invariant');

var tryRequireDependency = function tryRequireDependency(dependencyName) {
    try {
        var tryingRequire = require(dependencyName);
        if (tryingRequire) {
            logger.trace('getDependency | tryRequireDependency: require found item');
            logger.trace('getDependency | tryRequireDependency: adding it to graph');
            return { name: dependencyName,
                resolvedInstance: tryingRequire,
                wrappedInstance: function wrappedInstance() {
                    return tryingRequire;
                }
            };
        }
    } catch (ex) {
        logger.info('getDependency | tryRequireDependency: item was not found and require threw an error');
        logger.info('getDependency | tryRequireDependency: error' + ex);
        //swallow, just a hail mary to resolve
    }
};

var findDependency = function findDependency(_items, dependencyName) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = _items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var i = _step.value;

            logger.trace('getDependency | findDependency: ' + dependencyName + ' target :' + i.name);
            if (i.name === dependencyName) {
                logger.trace('getDependency | findDependency: item found ' + dependencyName);
                return i;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
                _iterator['return']();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
};

var fullDependency = function fullDependency(dependencyGraph, dependencyName) {
    invariant(dependencyGraph, 'You must provide a a collection of dependencies to query');
    invariant(dependencyName, 'You must provide a dependency name to find');
    var item;
    logger.trace('getDependency | fullDependency: Trying to find the dependency : ' + dependencyName);
    item = findDependency(dependencyGraph, dependencyName);
    if (!item) {
        logger.trace('getDependency | fullDependency: Single dependency not found. Trying to build grouped dependency : ' + dependencyName);
        item = groupDependencies(dependencyGraph, dependencyName);
    }if (!item) {
        logger.trace('getDependency | fullDependency: Grouped dependency not found.  Trying to require dependency: ' + dependencyName);
        item = tryRequireDependency(dependencyName);
    }
    return item;
};

var resolvedInstance = function resolvedInstance(dependencyGraph, dependencyName) {
    var dependency = fullDependency(dependencyGraph, dependencyName);
    if (Array.isArray(dependency)) {
        var groupedDependency = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = dependency[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var i = _step2.value;

                if (i.groupName == dependencyName) {
                    groupedDependency.push(i.resolvedInstance);
                }
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                    _iterator2['return']();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        return groupedDependency;
    }
    return dependency ? dependency.resolvedInstance : undefined;
};

module.exports = {
    fullDependency: fullDependency,
    resolvedInstance: resolvedInstance
};