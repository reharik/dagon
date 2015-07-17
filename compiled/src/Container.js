/**
 * Created by rharik on 6/23/15.
 */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ = require('lodash');
var RegistryDSL = require('./RegistryDSL');
var Graph = require('./Graph');
var applyRegistry = require('./applyRegistry');
var Dependency = require('./Dependency');
var GraphResolution = require('./GraphResolver');
var invariant = require('invariant');

module.exports = (function () {
    function Container(registryFuncArray) {
        _classCallCheck(this, Container);

        //TODO CLEAN UP!!
        if (!_.isArray(registryFuncArray)) {
            registryFuncArray = [registryFuncArray];
        }

        invariant(registryFuncArray && registryFuncArray[0] && _.isFunction(registryFuncArray[0]), 'Container requires at least one registry function');

        this.registryFunkArray = registryFuncArray;
        this.registry = this.buildRegistry();
        this.dependencyGraph = new Graph();
        var packageJson = require(this.registry.pathToPackageJson);
        this.dependencyGraph.buildGraph(packageJson);
        applyRegistry(this.registry, this.dependencyGraph);
        new GraphResolution().recurse(this.dependencyGraph);
    }

    _createClass(Container, [{
        key: 'buildRegistry',

        //TODO NEEDS TESTS!
        value: function buildRegistry() {
            var registry = { pathToRoot: '',
                dependencyDeclarations: [],
                renamedDeclarations: [] };
            this.registryFunkArray.forEach(function (x) {
                var reg = x(new RegistryDSL());
                registry.pathToPackageJson = registry.pathToPackageJson || reg.pathToPackageJson;
                registry.dependencyDeclarations = registry.dependencyDeclarations.concat(reg.dependencyDeclarations);
                registry.renamedDeclarations = registry.renamedDeclarations.concat(reg.renamedDeclarations);
            });
            invariant(registry.pathToPackageJson, 'You must provide the path to root when building a graph');

            return registry;
        }
    }, {
        key: 'getInstanceOf',
        value: function getInstanceOf(_type) {
            return this.dependencyGraph.findDependency(_type);
        }
    }, {
        key: 'whatDoIHave',
        value: function whatDoIHave(_options) {
            var options = _options || {};
            return this.dependencyGraph.mapItems(function (x) {
                var dependency = { name: x.name };
                if (options.showResolved) {
                    dependency.resolved = x.resolved;
                }
                if (options.showInstance && x.internal) {
                    dependency.instance = x.instance;
                }
                if (options.showInstanceForAll) {
                    dependency.instance = x.instance;
                }
                return dependency;
            });
        }
    }, {
        key: 'inject',
        value: function inject(dependencies) {
            var _this = this;

            if (!_.isArray(dependencies)) {
                dependencies = [dependencies];
            }
            this.dependencyGraph = new Graph();
            this.registry = this.buildRegistry();
            var packageJson = require(this.registry.pathToPackageJson);
            this.dependencyGraph.buildGraph(packageJson);
            applyRegistry(this.registry, this.dependencyGraph);

            dependencies.forEach(function (d) {
                invariant(d.name, 'injected dependecy must have a name');
                invariant(d.resolvedInstance || d.path, 'injected dependency must have either a resolvedInstance or a path');
                var newDep = d.resolvedInstance ? new Dependency({ name: d.name, resolvedInstance: d.resolvedInstance }) : new Dependency({ name: d.name, path: d.path, internal: d.internal });
                _this.dependencyGraph.addItem(newDep);
            });
            new GraphResolution().recurse(this.dependencyGraph);
        }
    }]);

    return Container;
})();