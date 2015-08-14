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
var JSON = require('JSON');
var logger = require('../src/yowlWrapper');
var _ = require('lodash');

module.exports = (function () {
    function Dependency(options) {
        _classCallCheck(this, Dependency);

        this.name = options.name;
        this.path = options.path;
        this.internal = options.internal || false;
        this.groupName = options.groupName || '';
        this.resolvedInstance = options.resolvedInstance;
        this.instantiate = options.instantiate;
        this._children;
        invariant(this.name, 'Dependency must have a valid name');
        invariant(this.path || this.resolvedInstance, 'Dependency ' + this.name + ' must have a valid path: ' + this.path);
        logger.trace('Dependency | constructor: Intialized with following properties: ' + JSON.stringify(this));

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
            logger.trace('Dependency | resolveInstance: resolving instance or returning if already resolved');
            if (this.resolvedInstance) {
                return;
            }
            logger.trace('Dependency | getCollectionOfDependencies: calling getResolvedInstanceForCollectionOfDependencies');
            var itemsDependencies = this.getResolvedInstanceForCollectionOfDependencies(this.getCollectionOfDependencies(graph));
            this.resolvedInstance = this._instantiate(itemsDependencies);

            invariant(this.resolvedInstance, this.name + ' instance must resolve in resolveInstance function');
        }
    }, {
        key: '_instantiate',
        value: function _instantiate(resolvedDependencies) {
            logger.trace('Dependency | instantiate: actually resolving instances');
            logger.trace('Dependency | instantiate: if no dependencies just call wrappedInstance, otherwise apply function with dependencies');
            var parent = resolvedDependencies.length > 0 ? this.wrappedInstance.apply(this.wrappedInstance, resolvedDependencies) : this.wrappedInstance();
            if (this.instantiate) {
                logger.trace('Dependency | instantiate: calling instantiateResolvedInstance to do post resolution modifications');
                return this.instantiateResolvedInstance(parent); //parent.apply(parent, this.instantiateWith)
            }
            return parent;
        }
    }, {
        key: 'instantiateResolvedInstance',
        value: function instantiateResolvedInstance(resolved) {
            if (this.instantiate.dependencyType == 'class') {
                logger.debug('Dependency | instantiateResolvedInstance: item is class so call new with constructor params if present');
                if (this.instantiate.parameters) {
                    var i = Object.create(resolved.prototype);
                    var r = resolved.apply(i, this.instantiate.parameters);
                    resolved = Object(r) === r ? r : i;
                } else {
                    resolved = new resolved();
                }
            }
            if (this.instantiate.dependencyType == 'func') {
                logger.debug('Dependency | instantiateResolvedInstance: item is func so "call" or just call()');
                if (this.instantiate.parameters) {
                    resolved = resolved.call(resolved, this.instantiate.parameters);
                } else {
                    resolved = resolved();
                }
            }
            if (this.instantiate.initializationMethod) {
                logger.debug('Dependency | instantiateResolvedInstance: item has an initialization method so call that with params if present');
                if (this.instantiate.initParameters) {
                    resolved = resolved[this.instantiate.initializationMethod].apply(resolved[this.instantiate.initializationMethod], this.instantiate.initParameters);
                } else {
                    resolved = resolved[this.instantiate.initializationMethod]();
                }
            }
            return resolved;
        }
    }, {
        key: 'getCollectionOfDependencies',
        value: function getCollectionOfDependencies(graph) {
            var _this = this;

            logger.trace('Dependency | getCollectionOfDependencies: getting args from wrapper function and finding instances in graph');
            var args = fnArgs(this.wrappedInstance);
            logger.trace('Dependency | getCollectionOfDependencies: args: ' + args);
            return args.map(function (d) {
                var item = graph.findRequiredDependency(d);
                if (!item) {
                    item = graph.findGroupedDependencies(d);
                }
                if (!item) {
                    logger.debug('Dependency | getCollectionOfDependencies: can not find dependency: ' + d);
                    logger.debug('Dependency | getCollectionOfDependencies: ' + graph._items.map(function (x) {
                        return x.name;
                    }));
                    invariant(false, 'Module ' + _this.name + ' has a dependency that can not be resolved: ' + d);
                }
                return item;
            });
        }
    }, {
        key: 'getResolvedInstanceForCollectionOfDependencies',
        value: function getResolvedInstanceForCollectionOfDependencies(dependencies) {
            var _this2 = this;

            logger.trace('Dependency | getResolvedInstanceForCollectionOfDependencies: getting resolved instances recursively');
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
            logger.debug('Dependency | getChildren: flattening out graph of dependencies');
            this._children = this.flatten(this.getCollectionOfDependencies(graph));
            logger.debug('Dependency | getChildren: has ' + this._children.length + ' children');
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
            logger.trace('Dependency | handleResolvedInstancePassedIn: reoslved instance passed so wrapping resolved instance in function');
            this.wrappedInstance = function () {
                return this.resolvedInstance;
            };
        }
    }, {
        key: 'handleInternalDependency',
        value: function handleInternalDependency() {
            logger.trace('Dependency | handleInternalDependency: internal module so requiring item using path. no need to wrap in function ');
            var resolvedPath = _path.join(appRoot.path, this.path);
            //DANGER DANGER
            this.wrappedInstance = require(resolvedPath);
            invariant(_.isFunction(this.wrappedInstance), 'Dependency | handleInternalDependency: dagon is unable to require the following dependency: ' + this.name + ' at this path: ' + resolvedPath);
        }
    }, {
        key: 'handleExternalModule',
        value: function handleExternalModule() {
            logger.trace('Dependency | handleExternalModule: external module so requiring item using path and wrapping in function ');
            this.wrappedInstance = function () {
                //DANGER DANGER
                return require(this.path);
            };
        }
    }]);

    return Dependency;
})();