/**
 * Created by rharik on 6/30/15.
 */

var invariant = require('invariant');
var fnArgs = require('fn-args');
var _path = require('path');
var appRoot = require('./appRoot');


module.exports = class Dependency{
    constructor(options){
        this.name = options.name;
        this.path = options.path;
        this.internal = options.internal || false;
        this.groupName = options.groupName || '';
        this.resolvedInstance = options.resolvedInstance;
        this.instantiate = options.instantiate;
        this._children;
        invariant(this.name, 'Dependency must have a valid name');
        invariant(this.path || this.resolvedInstance,
            'Dependency ' + this.name + ' must have a valid path: '+this.path);

        if(this.resolvedInstance){
            this.handleResolvedInstancePassedIn();
        }
        else if (this.internal) {
            this.handleInternalDependency();

        } else {
            this.handleExternalModule();
        }
    }

    resolveInstance(graph){
        if(this.resolvedInstance){return;}
        var itemsDependencies = this.getResolvedInstanceForCollectionOfDependencies(this.getCollectionOfDependencies(graph));
        this.resolvedInstance = this._instantiate(itemsDependencies);

        invariant(this.resolvedInstance, this.name + ' instance must resolve in resolveInstance function')
    }

    _instantiate(resolvedDependencies){
        var parent = resolvedDependencies.length>0
            ? this.wrappedInstance.apply(this.wrappedInstance, resolvedDependencies)
            : this.wrappedInstance();
        if(this.instantiate){
            return this.instantiateResolvedInstance(parent);  //parent.apply(parent, this.instantiateWith)
        }
        return parent;
    }

    instantiateResolvedInstance(resolved){
        if(this.instantiate.dependencyType == 'class'){
            if(this.instantiate.parameters){
                var i = Object.create(resolved.prototype);
                var r = resolved.apply(i, this.instantiate.parameters);
                resolved = Object(r) === r? r : i
            }else{
                resolved = new resolved();
            }
        }
        if(this.instantiate.dependencyType == 'func'){
            if(this.instantiate.parameters){
                resolved = resolved.call(resolved,this.instantiate.parameters);
            }else{
                resolved = resolved();
            }
        }
        if(this.instantiate.initializationMethod){
            if(this.instantiate.initParameters){
                resolved = resolved[this.instantiate.initializationMethod].apply(resolved[this.instantiate.initializationMethod],this.instantiate.initParameters)
            }else{
                resolved = resolved[this.instantiate.initializationMethod]()
            }
        }
        return resolved;

    }

    getCollectionOfDependencies(graph){
        return fnArgs(this.wrappedInstance).map( d=> {
            var item = graph.findRequiredDependency(d);
            if(!item) {
                item = graph.findGroupedDependencies(this.name, d);
            }
            return item;
        });
    }

    getResolvedInstanceForCollectionOfDependencies(dependencies){
        var result = [];
        dependencies.forEach(x=> {
            if (Array.isArray(x)) {
                result.push(this.getResolvedInstanceForCollectionOfDependencies(x));
            }
            else{result.push(x.resolvedInstance);}
        });
        return result;
    }

    flatten(array) {
        return Array.isArray(array) ? [].concat.apply([], array.map(x=>this.flatten(x))||[]) : array;
    }

    getChildren(graph){
        this._children = this.flatten(this.getCollectionOfDependencies(graph));
        //console.log(this.getCollectionOfDependencies(graph));
        //console.log(this._children);
        return this._children.length > 0;
    }

    children(){
        return this._children;
    }

    handleResolvedInstancePassedIn() {
        this.wrappedInstance = function(){return this.resolvedInstance;};
    }

    handleInternalDependency() {
        var resolvedPath = _path.join(appRoot.path, this.path);
        //DANGER DANGER
        this.wrappedInstance = require(resolvedPath);
    }

    handleExternalModule() {
        this.wrappedInstance = function () {
            //DANGER DANGER
            return require(this.path);
        };
    }

};