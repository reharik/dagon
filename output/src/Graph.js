/**
 * Created by rharik on 6/30/15.
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var invariant = require('invariant');
var Dependency = require('./Dependency');
var _ = require('lodash');
var logger = require('./yowlWrapper');

module.exports = (function () {
    function Graph() {
        _classCallCheck(this, Graph);

        this._items = [];
    }

    _createClass(Graph, [{
        key: 'addItem',
        value: function addItem(dependency) {
            invariant(dependency, 'You must provide a dependency to add');
            logger.trace('Graph | addItem: remove original if present');
            _.remove(this._items, function (x) {
                return x.name == dependency.name;
            });
            logger.trace('Graph | addItem: add new item');
            this._items.push(dependency);
        }
    }, {
        key: '_findItem',
        value: function _findItem(dependencyName) {
            invariant(dependencyName, 'You must provide a dependency name to find');
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var i = _step.value;

                    logger.trace('Graph | findItem: ' + dependencyName + ' target :' + i.name);
                    if (i.name === dependencyName) {
                        logger.trace('Graph | findItem: item found');
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

            try {
                logger.trace('Graph | findItem: item NOT found, trying to require(dep)');
                var tryingRequire = require(dependencyName);
                if (tryingRequire) {
                    logger.trace('Graph | findItem: require found item');
                    logger.trace('Graph | findItem: adding it to graph');
                    return new Dependency({ name: dependencyName, resolvedInstance: tryingRequire }, logger);
                }
            } catch (ex) {
                logger.info('Graph | findItem: item was not found and require threw an error');
                logger.info('Graph | findItem: error' + ex);
                //swallow, just a hail mary to resolve
            }
        }
    }, {
        key: 'findRequiredDependency',
        value: function findRequiredDependency(dependencyName) {
            var item = this._findItem(dependencyName);
            if (item) {
                return item;
            }
        }

        //TODO needs tests
    }, {
        key: 'findGroupedDependencies',
        value: function findGroupedDependencies(groupName, groupAsArray) {
            logger.trace('Graph | findGroupedDependencies: looping through items');
            if (!groupName.contains('_hash') || groupAsArray) {
                return buildGroupAsArray(groupName);
            }
            return buildGroupAsHash(groupName);
        }

        //TODO needs tests
    }, {
        key: 'buildGroupAsHash',
        value: function buildGroupAsHash(groupName) {
            groupName = groupName.replace('_hash', '');
            var item = {};
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this._items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var i = _step2.value;

                    logger.trace('Graph | findGroupedDependencies: looking for groupName: ' + groupName);
                    logger.trace('Graph | findGroupedDependencies: item groupName: ' + i.groupName);
                    if (i.groupName === groupName) {
                        logger.trace('Graph | findGroupedDependencies: found item in group: ' + i.name);
                        item[i.name] = i;
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

            return item;
        }
    }, {
        key: 'buildGroupAsArray',
        value: function buildGroupAsArray(groupName) {
            groupName = groupName.replace('_array', '');
            var item = [];
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this._items[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var i = _step3.value;

                    logger.trace('Graph | findGroupedDependencies: looking for groupName: ' + groupName);
                    logger.trace('Graph | findGroupedDependencies: item groupName: ' + i.groupName);
                    if (i.groupName === groupName) {
                        logger.trace('Graph | findGroupedDependencies: found item in group: ' + i.name);
                        item.push(i);
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                        _iterator3['return']();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            if (item.length > 0) {
                return item;
            }
        }
    }, {
        key: 'findDependency',
        value: function findDependency(type) {
            var item = this._findItem(type);
            logger.trace('Graph | findDependency: returning resolved instance');
            if (item) {
                return item.resolvedInstance;
            }
        }
    }, {
        key: 'mapItems',
        value: function mapItems(func) {
            return this._items.map(func);
        }
    }, {
        key: 'buildGraph',
        value: function buildGraph(pjson) {
            var _this = this;

            invariant(pjson, 'You must provide a json object to build graph from');
            if (pjson.dependencies) {
                logger.trace('Graph | buildGraph: reading package.json dependencies');
                Object.keys(pjson.dependencies).forEach(function (x) {
                    var name = _this.normalizeName(x);
                    _this._items.push(new Dependency({ name: name, path: x }, logger));
                });
            }
            if (pjson.internalDependencies) {
                logger.trace('Graph | buildGraph: reading package.json internalDependencies');
                Object.keys(pjson.internalDependencies).forEach(function (x) {
                    var name = _this.normalizeName(x);
                    _this._items.push(new Dependency({ name: name, path: pjson.internalDependencies[x], internal: true }, logger));
                });
            }
        }
    }, {
        key: 'normalizeName',
        value: function normalizeName(orig) {
            var name = orig.replace(/-/g, '');
            name = name.replace(/\./g, '_');
            logger.trace('Graph | normalizeName: normalizing name: ' + orig + '->' + name);
            return name;
        }
    }, {
        key: 'items',
        value: function items() {
            return this._items;
        }
    }]);

    return Graph;
})();