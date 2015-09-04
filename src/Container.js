/**
 * Created by rharik on 6/23/15.
 */
var _ = require('lodash');
var RegistryDSL = require('./RegistryDSL');
var Graph = require('./Graph');
var applyRegistry = require('./applyRegistry');
var Dependency = require('./Dependency');
var GraphResolution = require('./GraphResolver');
var invariant = require('invariant');
var logger = require('./yowlWrapper');
var JSON = require('JSON');

module.exports =  class Container{
    constructor(registryFuncArray){
        //TODO CLEAN UP!!
        if(!_.isArray(registryFuncArray)){registryFuncArray = [registryFuncArray]}

        invariant(registryFuncArray
            && registryFuncArray[0]
            && _.isFunction(registryFuncArray[0]), 'Container requires at least one registry function');

        this.registryFunkArray = registryFuncArray;
        this.registry = this.buildRegistry();
        logger.trace('Container | constructor : instantiate new graph');
        this.dependencyGraph = new Graph(logger);
        logger.trace('Container | constructor : get package.json');
        var packageJson =  require(this.registry.pathToPackageJson);
        logger.trace('Container | constructor : build new graph');
        this.dependencyGraph.buildGraph(packageJson);
        logger.trace('Container | constructor : apply registry');
        applyRegistry(this.registry, this.dependencyGraph);
        logger.trace('Container | constructor : resolve graph');
        new GraphResolution(logger).recurse(this.dependencyGraph);
    }

    //TODO NEEDS TESTS!
    buildRegistry(){
        logger.debug('Container | buildRegistry: building registry');
        var registry= {pathToRoot:'',
            dependencyDeclarations:[],
            renamedDeclarations:[]};
        this.registryFunkArray.forEach(x=>{
            var reg = x(new RegistryDSL(logger));
            registry.pathToPackageJson = registry.pathToPackageJson || reg.pathToPackageJson;

            logger.trace('Container | buildRegistry: pathToPackageJson: '+registry.pathToPackageJson);
            registry.dependencyDeclarations = registry.dependencyDeclarations.concat(reg.dependencyDeclarations);

            logger.trace('Container | buildRegistry: dependencyDeclarations: '+ JSON.stringify(registry.pathToPackageJson));
            registry.renamedDeclarations = registry.renamedDeclarations.concat(reg.renamedDeclarations);

            logger.trace('Container | buildRegistry: renamedDeclarations: '+ JSON.stringify(registry.renamedDeclarations));
        });
        invariant(registry.pathToPackageJson, 'You must provide the path to root when building a graph');
        logger.trace('Container | buildRegistry: registry: '+ JSON.stringify(registry));
        return registry;
    }

    /**
     *
     * @param type - the type of dependency you want to get
     * @returns {type}
     */
    getInstanceOf(_type) {
        return this.dependencyGraph.findDependency(_type)
    }

    /**
     *
     * @param groupName - the groupName of dependencies you want to get
     * @returns {type}
     */
    getArrayOfGroup(_groupName){
        return this.dependencyGraph.findGroupedDependencies(_groupName);
    }

    getHashOfGroup(_groupName) {
        var group = this.dependencyGraph.findGroupedDependencies(_groupName, true);
        var hash = {};
        group.forEach(x=> hash[x.name] = x);
        return hash;
    }

    /**
     *
     * @param type - the type of dependency you want to get
     * @returns {type}
     */
    whatDoIHave(_options) {
        var options = _options || {};
        return this.dependencyGraph.mapItems(x=>{
            var dependency = {name: x.name};
            if(options.showResolved) { dependency.resolvedInstance = x.resolvedInstance ;}
            if(options.showWrappedInstance) { dependency.wrappedInstance = x.wrappedInstance;}
            return dependency
        });
    }

    inject(dependencies) {
        if(!_.isArray(dependencies)){ dependencies = [dependencies];}
        logger.trace('Container | injection: instantiate new graph');
        this.dependencyGraph = new Graph(logger);
        this.registry = this.buildRegistry();
        logger.trace('Container | injection: get package.json');
        var packageJson =  require(this.registry.pathToPackageJson);
        logger.trace('Container | injection: build new graph');
        this.dependencyGraph.buildGraph(packageJson);
        logger.trace('Container | injection: apply registry');
        applyRegistry(this.registry, this.dependencyGraph);

        logger.trace('Container | injection: build injected dependencies');
        dependencies.forEach(d => {
            invariant(d.name, 'injected dependecy must have a name');
            invariant(d.resolvedInstance || d.path, 'injected dependency must have either a resolvedInstance or a path');
            var newDep = new Dependency(d, logger);
            logger.trace('Container | injection: add new dependency to graph');
            this.dependencyGraph.addItem(newDep);
        });
        logger.trace('Container | injection: resolve new graph');
        new GraphResolution(logger).recurse(this.dependencyGraph);

    }

};



