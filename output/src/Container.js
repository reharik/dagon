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
var logger = require('./yowlWrapper');
var JSON = require('JSON');

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

        logger.trace('Container | constructor : instantiate new graph');
        this.dependencyGraph = new Graph(logger);

        logger.trace('Container | constructor : get package.json');
        var packageJson = require(this.registry.pathToPackageJson);

        logger.trace('Container | constructor : build new graph');
        this.dependencyGraph.buildGraph(packageJson);

        logger.trace('Container | constructor : apply registry');
        applyRegistry(this.registry, this.dependencyGraph, logger);

        logger.trace('Container | constructor : resolve graph');
        new GraphResolution(logger).recurse(this.dependencyGraph);
    }

    //TODO NEEDS TESTS!

    _createClass(Container, [{
        key: 'buildRegistry',
        value: function buildRegistry() {
            logger.debug('Container | buildRegistry: building registry');
            var registry = { pathToRoot: '',
                dependencyDeclarations: [],
                renamedDeclarations: [] };
            this.registryFunkArray.forEach(function (x) {
                var reg = x(new RegistryDSL(logger));
                registry.pathToPackageJson = registry.pathToPackageJson || reg.pathToPackageJson;

                logger.trace('Container | buildRegistry: pathToPackageJson: ' + registry.pathToPackageJson);
                registry.dependencyDeclarations = registry.dependencyDeclarations.concat(reg.dependencyDeclarations);

                logger.trace('Container | buildRegistry: dependencyDeclarations: ' + JSON.stringify(registry.pathToPackageJson));
                registry.renamedDeclarations = registry.renamedDeclarations.concat(reg.renamedDeclarations);

                logger.trace('Container | buildRegistry: renamedDeclarations: ' + JSON.stringify(registry.renamedDeclarations));
            });
            invariant(registry.pathToPackageJson, 'You must provide the path to root when building a graph');
            logger.trace('Container | buildRegistry: registry: ' + JSON.stringify(registry));
            return registry;
        }

        /**
         *
         * @param type - the type of dependency you want to get
         * @returns {type}
         */
    }, {
        key: 'getInstanceOf',
        value: function getInstanceOf(_type) {
            return this.dependencyGraph.findDependency(_type);
        }

        /**
         *
         * @param groupName - the groupName of dependencies you want to get
         * @returns {type}
         */
    }, {
        key: 'getArrayOfGroup',
        value: function getArrayOfGroup(_groupName) {
            return this.dependencyGraph.findGroupedDependencies(_groupName);
        }
    }, {
        key: 'getHashOfGroup',
        value: function getHashOfGroup(_groupName) {
            var group = this.dependencyGraph.findGroupedDependencies(_groupName, true);
            var hash = {};
            group.forEach(function (x) {
                return hash[x.name] = x;
            });
            return hash;
        }

        /**
         *
         * @param type - the type of dependency you want to get
         * @returns {type}
         */
    }, {
        key: 'whatDoIHave',
        value: function whatDoIHave(_options) {
            var options = _options || {};
            return this.dependencyGraph.mapItems(function (x) {
                var dependency = { name: x.name };
                if (options.showResolved) {
                    dependency.resolvedInstance = x.resolvedInstance;
                }
                if (options.showWrappedInstance) {
                    dependency.wrappedInstance = x.wrappedInstance;
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
            logger.trace('Container | injection: instantiate new graph');
            this.dependencyGraph = new Graph(logger);
            this.registry = this.buildRegistry();
            logger.trace('Container | injection: get package.json');
            var packageJson = require(this.registry.pathToPackageJson);
            logger.trace('Container | injection: build new graph');
            this.dependencyGraph.buildGraph(packageJson);
            logger.trace('Container | injection: apply registry');
            applyRegistry(this.registry, this.dependencyGraph);

            logger.trace('Container | injection: build injected dependencies');
            dependencies.forEach(function (d) {
                invariant(d.name, 'injected dependecy must have a name');
                invariant(d.resolvedInstance || d.path, 'injected dependency must have either a resolvedInstance or a path');
                var newDep = new Dependency(d, logger);
                logger.trace('Container | injection: add new dependency to graph');
                _this.dependencyGraph.addItem(newDep);
            });
            logger.trace('Container | injection: resolve new graph');
            new GraphResolution(logger).recurse(this.dependencyGraph);
        }
    }]);

    return Container;
})();