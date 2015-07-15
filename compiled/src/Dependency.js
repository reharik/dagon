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
            var _this = this;

            if (this.resolvedInstance) {
                return;
            }
            var itemsDependencies = [];
            fnArgs(this.wrappedInstance).forEach(function (d) {
                return itemsDependencies.push(graph.findRequiredDependency(_this.name, d).resolvedInstance);
            });
            this.resolvedInstance = itemsDependencies.length > 0 ? this.wrappedInstance.apply(this.wrappedInstance, itemsDependencies) : this.wrappedInstance();
            invariant(this.resolvedInstance, this.name + ' instance must resolve in resolveInstance function');
        }
    }, {
        key: 'getChildren',
        value: function getChildren(graph) {
            var _this2 = this;

            this._children = [];
            fnArgs(this.wrappedInstance).forEach(function (d) {
                var item = graph.findRequiredDependency(_this2.name, d);
                _this2._children.push(item);
            });
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