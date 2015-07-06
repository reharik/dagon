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


module.exports =  class Container{
    constructor(registryFunc){
        invariant(registryFunc && _.isFunction(registryFunc), 'Container requires a registry function');
        this.registryFunc = registryFunc;
        this.registry = registryFunc(new RegistryDSL());

        this.dependencyGraph = new Graph();
        var packageJson =  require(this.registry.pathToPackageJson);
        this.dependencyGraph.buildGraph(packageJson);
        applyRegistry(this.registry, this.dependencyGraph);
        new GraphResolution().recurse(this.dependencyGraph);
    }

    getInstanceOf(_type) {
        return this.dependencyGraph.findDependency(_type)
    }

    whatDoIHave(_options) {
        var options = _options || {};
        return this.dependencyGraph.mapItems(x=>{
            var dependency = {name: x.name};
            if(options.showResolved) { dependency.resolved = x.resolved ;}
            if(options.showInstance && x.internal) { dependency.instance = x.instance;}
            if(options.showInstanceForAll) { dependency.instance = x.instance;}
            return dependency
        });
    }

    inject(dependencies) {
        if(!_.isArray(dependencies)){ dependencies = [dependencies];}
        this.dependencyGraph = new Graph();
        this.registry = this.registryFunc(new RegistryDSL());
        var packageJson =  require(this.registry.pathToPackageJson);
        this.dependencyGraph.buildGraph(packageJson);
        applyRegistry(this.registry, this.dependencyGraph);

        dependencies.forEach(d => {
            invariant(d.name, 'injected dependecy must have a name');
            invariant(d.resolvedInstance || d.path, 'injected dependency must have either a resolvedInstance or a path');
            var newDep = d.resolvedInstance
                ? new Dependency({name:d.name, resolvedInstance:d.resolvedInstance})
                : new Dependency({name: d.name, path: d.path, internal : d.internal});
            this.dependencyGraph.addItem(newDep);
        });
        new GraphResolution().recurse(this.dependencyGraph);

    }

};



