/**
 * Created by rharik on 6/23/15.
 */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ = require('lodash');
var RegistryDSL = require('./RegistryDSL');
var buildListofDependencies = require('./buildListofDependencies');
var graphResolution = require('./graphResolver');
var invariant = require('invariant');
var JSON = require('JSON');
var logger = require('./logger');
var path = require('path');
var exceptionHandler = require('./exceptionHandler');

module.exports = (function () {
    function Container(registryFunc) {
        _classCallCheck(this, Container);

        try {
            invariant(registryFunc && _.isFunction(registryFunc), 'You must supply a registry function');

            logger.trace('Container | constructor : Building registry');
            this.registry = registryFunc(new RegistryDSL());

            logger.trace('Container | constructor : get package.json');
            var packageJson = require(path.join(this.registry.pathToAppRoot, '/package.json'));

            logger.trace('Container | constructor : Build list of Dependencies');
            this.dependencyGraph = buildListofDependencies(this.registry.dependencyDeclarations, packageJson);

            logger.trace('Container | constructor : resolve graph');
            graphResolution(this.dependencyGraph);
        } catch (err) {
            throw exceptionHandler(err, 'Error building dependency graph.  Check nested exceptions for more details.');
        }
    }

    /**
     *
     * @param type - the type of dependency you want to get
     * @returns {type}
     */

    _createClass(Container, [{
        key: 'getInstanceOf',
        value: function getInstanceOf(_type) {
            var item = this.dependencyGraph.find(function (x) {
                return x.name == _type;
            });
            return item ? item.resolvedInstance : null;
        }

        /**
         *
         * @param groupName - the groupName of dependencies you want to get
         * @returns {type}
         */
    }, {
        key: 'getArrayOfGroup',
        value: function getArrayOfGroup(_groupName) {
            return this.dependencyGraph.map(function (x) {
                return x.groupName == _groupName;
            });
        }
    }, {
        key: 'getHashOfGroup',
        value: function getHashOfGroup(_groupName) {
            var group = getArrayOfGroup(_groupName);
            var hash = {};
            group.forEach(function (x) {
                return hash[x.name] = x;
            });
            return hash;
        }

        /**
         *
         * @param type - return graph of all registered dependencies
         * @returns {json}
         */
    }, {
        key: 'whatDoIHave',
        value: function whatDoIHave(_options) {
            var options = _options || {};
            return this.dependencyGraph.map(function (x) {
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

        //inject(dependencies) {
        //    if(!_.isArray(dependencies)){ dependencies = [dependencies];}
        //    logger.trace('Container | injection: instantiate new graph');
        //    this.dependencyGraph = new Graph(logger);
        //    this.registry = this.buildRegistry();
        //    logger.trace('Container | injection: get package.json');
        //    var packageJson =  require(this.registry.pathToAppRoot);
        //    logger.trace('Container | injection: build new graph');
        //    this.dependencyGraph.buildGraph(packageJson);
        //    logger.trace('Container | injection: apply registry');
        //    applyRegistry(this.registry, this.dependencyGraph);
        //
        //    logger.trace('Container | injection: build injected dependencies');
        //    dependencies.forEach(d => {
        //        invariant(d.name, 'injected dependecy must have a name');
        //        invariant(d.resolvedInstance || d.path, 'injected dependency must have either a resolvedInstance or a path');
        //        var newDep = new Dependency(d, logger);
        //        logger.trace('Container | injection: add new dependency to graph');
        //        this.dependencyGraph.addItem(newDep);
        //    });
        //    logger.trace('Container | injection: resolve new graph');
        //    new GraphResolution(logger).recurse(this.dependencyGraph);
        //
        //}

    }]);

    return Container;
})();