/**
 * Created by rharik on 6/30/15.
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var invariant = require('invariant');
var Dependency = require('./Dependency');
var _ = require('lodash');

module.exports = (function () {
    function Graph() {
        _classCallCheck(this, Graph);

        this._items = [];
    }

    _createClass(Graph, [{
        key: 'addItem',
        value: function addItem(dependency) {
            invariant(dependency, 'You must provide a dependency to add');
            _.remove(this._items, function (x) {
                return x.name == dependency.name;
            });
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

                    if (i.name === dependencyName) {
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
                var tryingRequire = require(dependencyName);
                if (tryingRequire) {
                    return new Dependency({ name: dependencyName, resolvedInstance: tryingRequire });
                }
            } catch (ex) {}
        }
    }, {
        key: 'findRequiredDependency',
        value: function findRequiredDependency(dependencyName) {
            var item = this._findItem(dependencyName);
            if (item) {
                return item;
            }
        }
    }, {
        key: 'findGroupedDependencies',
        value: function findGroupedDependencies(caller, groupName) {
            var item = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this._items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var i = _step2.value;

                    if (i.groupName === groupName) {
                        item.push(i);
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

            if (item.length > 0) {
                return item;
            }
            invariant(false, 'Module ' + caller + ' has a dependency that can not be resolved: ' + groupName);
        }
    }, {
        key: 'findDependency',
        value: function findDependency(type) {
            var item = this._findItem(type);
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
                Object.keys(pjson.dependencies).forEach(function (x) {
                    _this._items.push(new Dependency({ name: x.replace(/-/g, ''), path: x }));
                });
            }
            if (pjson.internalDependencies) {
                Object.keys(pjson.internalDependencies).forEach(function (x) {
                    _this._items.push(new Dependency({ name: x, path: pjson.internalDependencies[x], internal: true }));
                });
            }
        }
    }, {
        key: 'items',
        value: function items() {
            return this._items;
        }
    }]);

    return Graph;
})();

//swallow, just a hail mary to resolve