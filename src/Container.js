/**
 * Created by rharik on 6/23/15.
 */
var path = require('path');
var _ = require('lodash');
var RegistryDSL = require('./RegistryDSL');
var Graph = require('./Graph');
var applyRegistry = require('./applyRegistry');
var GraphResolution = require('./GraphResolver');
var fnArgs = require('fn-args');
var appRoot = path.resolve('./');
var invariant = require('invariant');


module.exports =  class Container{
    constructor(registryFunc){
        invariant(registryFunc && _.isFunction(registryFunc), 'Container requires a registry function');
        this.registry = registryFunc(new RegistryDSL());

        this.dependencyGraph = new Graph();
        var packageJson =  require(this.registry.pathToPackageJson);
        this.dependencyGraph.buildGraph(packageJson);

        applyRegistry(this.registry, this.dependencyGraph);
        new GraphResolution().recurse(this.dependencyGraph);
    }

    getInstanceOf(_type) {
        this.dependencyGraph.findDependency(_type)
    }

    whatDoIHave(options) {
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
        dependencies.forEach(d => {
            invariant(d.name, 'injected dependecy must have a name');
            invariant(d.instance || d.path, 'injected dependecy must have either an instance or a path');
        });
        this.dependencyGraph.inject(dependencies);
    }

};



