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
        //console.log('itemsDepend);
        //console.log(this.name);
        //console.log(itemsDependencies);
        this.resolvedInstance = itemsDependencies.length>0
            ? this.wrappedInstance.apply(this.wrappedInstance, itemsDependencies)
            : this.wrappedInstance();

        invariant(this.resolvedInstance, this.name + ' instance must resolve in resolveInstance function')
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
        var result = dependencies.map(x=> {
            if(!Array.isArray(x)){
                return x.resolvedInstance;
            }
            this.getResolvedInstanceForCollectionOfDependencies(x);
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
        this.wrappedInstance = require(resolvedPath);
    }

    handleExternalModule() {
        this.wrappedInstance = function () {
            return require(this.path);
        };
    }
};