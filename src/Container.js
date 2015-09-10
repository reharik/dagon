/**
 * Created by rharik on 6/23/15.
 */
var _ = require('lodash');
var RegistryDSL = require('./RegistryDSL');
var buildListofDependencies = require('./buildListofDependencies');
var graphResolution = require('./graphResolver');
var invariant = require('invariant');
var JSON = require('JSON');
var logger = require('./logger');

module.exports =  class Container{
    constructor(registryFunc) {

        invariant(registryFunc && _.isFunction(registryFunc),
            'You must supply a registry function');

        logger.trace('Container | constructor : Building registry');
        this.registry = registryFunc(new RegistryDSL());

        logger.trace('Container | constructor : get package.json');
        var packageJson        = require(this.registry.pathToPackageJson);

        logger.trace('Container | constructor : Build list of Dependencies');
        this.dependencyGraph = buildListofDependencies(this.registry.dependencyDeclarations, packageJson);

        logger.trace('Container | constructor : resolve graph');
        graphResolution(this.dependencyGraph);

    }

    /**
     *
     * @param type - the type of dependency you want to get
     * @returns {type}
     */
    getInstanceOf(_type) {
        var item = this.dependencyGraph.find(x=>x.name == _type);
        return item  ? item.resolvedInstance : null;
    }

    /**
     *
     * @param groupName - the groupName of dependencies you want to get
     * @returns {type}
     */
    getArrayOfGroup(_groupName){
        return this.dependencyGraph.map(x=>x.groupName == _groupName);
    }

    getHashOfGroup(_groupName) {
        var group = getArrayOfGroup(_groupName);
        var hash = {};
        group.forEach(x=> hash[x.name] = x);
        return hash;
    }

    /**
     *
     * @param type - return graph of all registered dependencies
     * @returns {json}
     */
    whatDoIHave(_options) {
        var options = _options || {};
        return this.dependencyGraph.map(x=>{
            var dependency = {name: x.name};
            if(options.showResolved) { dependency.resolvedInstance = x.resolvedInstance ;}
            if(options.showWrappedInstance) { dependency.wrappedInstance = x.wrappedInstance;}
            return dependency
        });
    }

    //inject(dependencies) {
    //    if(!_.isArray(dependencies)){ dependencies = [dependencies];}
    //    logger.trace('Container | injection: instantiate new graph');
    //    this.dependencyGraph = new Graph(logger);
    //    this.registry = this.buildRegistry();
    //    logger.trace('Container | injection: get package.json');
    //    var packageJson =  require(this.registry.pathToPackageJson);
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

};



