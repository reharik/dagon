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
    constructor(registryFuncArray){
        //TODO CLEAN UP!!
        if(!_.isArray(registryFuncArray)){registryFuncArray = [registryFuncArray]}

        invariant(registryFuncArray
            && registryFuncArray[0]
            && _.isFunction(registryFuncArray[0]), 'Container requires at least one registry function');

        this.registryFunkArray = registryFuncArray;
        this.registry = this.buildRegistry();
        this.dependencyGraph = new Graph(this.registry.appRoot);
        var packageJson =  require(this.registry.pathToPackageJson);
        this.dependencyGraph.buildGraph(packageJson);
        applyRegistry(this.registry, this.dependencyGraph);
        new GraphResolution().recurse(this.dependencyGraph);
    }

    //TODO NEEDS TESTS!
    buildRegistry(){
        var registry= {pathToRoot:'',
            dependencyDeclarations:[],
            renamedDeclarations:[]};
        this.registryFunkArray.forEach(x=>{
            var reg = x(new RegistryDSL());
            registry.appRoot = registry.appRoot || reg.appRoot;
            registry.pathToPackageJson = registry.pathToPackageJson || reg.pathToPackageJson;
            if(reg.dependencyDeclarations.length>0) {
                registry.dependencyDeclarations = registry.dependencyDeclarations.length<=0
                    ? reg.dependencyDeclarations
                    : registry.dependencyDeclarations.concat(reg.dependencyDeclarations)
            }
            if(reg.renamedDeclarations.length>0) {
                registry.renamedDeclarations = registry.renamedDeclarations.length<=0
                    ? reg.renamedDeclarations
                    : registry.renamedDeclarations.concat(reg.renamedDeclarations)
            }
        });
        return registry;
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
        this.dependencyGraph = new Graph(this.registry.appRoot);
        this.registry = this.buildRegistry();
        var packageJson =  require(this.registry.pathToPackageJson);
        this.dependencyGraph.buildGraph(packageJson);
        applyRegistry(this.registry, this.dependencyGraph);

        dependencies.forEach(d => {
            invariant(d.name, 'injected dependecy must have a name');
            invariant(d.resolvedInstance || d.path, 'injected dependency must have either a resolvedInstance or a path');
            var newDep = d.resolvedInstance
                ? new Dependency({name:d.name, resolvedInstance:d.resolvedInstance, appRoot:this.registry.appRoot})
                : new Dependency({name: d.name, path: d.path, internal : d.internal, appRoot:this.registry.appRoot});
            this.dependencyGraph.addItem(newDep);
        });
        new GraphResolution().recurse(this.dependencyGraph);

    }

};



