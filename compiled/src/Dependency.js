/**
 * Created by rharik on 6/30/15.
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var invariant = require('invariant');
var fnArgs = require('fn-args');
var _path = require('path');
var appRoot = require('./appRoot');

module.exports = (function () {
    function Dependency(options) {
        _classCallCheck(this, Dependency);

        this.name = options.name;
        this.path = options.path;
        this.internal = options.internal || false;
        this.groupName = options.groupName || '';
        this.resolvedInstance = options.resolvedInstance;
        this._children;
        invariant(this.name, 'Dependency must have a valid name');
        invariant(this.path || this.resolvedInstance, 'Dependency ' + this.name + ' must have a valid path: ' + this.path);

        if (this.resolvedInstance) {
            this.handleResolvedInstancePassedIn();
        } else if (this.internal) {
            this.handleInternalDependency();
        } else {
            this.handleExternalModule();
        }
    }

    _createClass(Dependency, [{
        key: 'resolveInstance',
        value: function resolveInstance(graph) {
            if (this.resolvedInstance) {
                return;
            }
            var itemsDependencies = this.getResolvedInstanceForCollectionOfDependencies(this.getCollectionOfDependencies(graph));
            this.resolvedInstance = itemsDependencies.length > 0 ? this.wrappedInstance.apply(this.wrappedInstance, itemsDependencies) : this.wrappedInstance();

            invariant(this.resolvedInstance, this.name + ' instance must resolve in resolveInstance function');
        }
    }, {
        key: 'getCollectionOfDependencies',
        value: function getCollectionOfDependencies(graph) {
            var _this = this;

            return fnArgs(this.wrappedInstance).map(function (d) {
                var item = graph.findRequiredDependency(d);
                if (!item) {
                    item = graph.findGroupedDependencies(_this.name, d);
                }
                return item;
            });
        }
    }, {
        key: 'getResolvedInstanceForCollectionOfDependencies',
        value: function getResolvedInstanceForCollectionOfDependencies(dependencies) {
            var _this2 = this;

            var result = [];
            dependencies.forEach(function (x) {
                if (Array.isArray(x)) {
                    result.push(_this2.getResolvedInstanceForCollectionOfDependencies(x));
                } else {
                    result.push(x.resolvedInstance);
                }
            });
            return result;
        }
    }, {
        key: 'flatten',
        value: function flatten(array) {
            var _this3 = this;

            return Array.isArray(array) ? [].concat.apply([], array.map(function (x) {
                return _this3.flatten(x);
            }) || []) : array;
        }
    }, {
        key: 'getChildren',
        value: function getChildren(graph) {
            this._children = this.flatten(this.getCollectionOfDependencies(graph));
            //console.log(this.getCollectionOfDependencies(graph));
            //console.log(this._children);
            return this._children.length > 0;
        }
    }, {
        key: 'children',
        value: function children() {
            return this._children;
        }
    }, {
        key: 'handleResolvedInstancePassedIn',
        value: function handleResolvedInstancePassedIn() {
            this.wrappedInstance = function () {
                return this.resolvedInstance;
            };
        }
    }, {
        key: 'handleInternalDependency',
        value: function handleInternalDependency() {
            var resolvedPath = _path.join(appRoot.path, this.path);
            this.wrappedInstance = require(resolvedPath);
        }
    }, {
        key: 'handleExternalModule',
        value: function handleExternalModule() {
            this.wrappedInstance = function () {
                return require(this.path);
            };
        }
    }]);

    return Dependency;
})();