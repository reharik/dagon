/**
 * Created by rharik on 6/30/15.
 */

var invariant = require('invariant');
var fnArgs = require('fn-args');

module.exports = class Dependency{
    constructor(name, path, internal){
        this.name = name;
        this.path = path;
        this.internal = internal || false;
        invariant(this.name && this.name.length > 1, 'Dependency must have a valid name');
        invariant(this.path && this.path.length > 1,
            'Dependency ' + this.name + ' must have a valid path: '+this.path);

        var item = require(path);
        this.wrappedInstance = internal ? item : function () {return item};
        this._children;
        this.resolvedInstance;
    }

    resolveInstance(graph){
        if(this.resolvedInstance){return;}
        var itemsDependencies = [];
        fnArgs(this.wrappedInstance).forEach(d=>  itemsDependencies.push(graph.findRequiredDependency(this.name, d).resolvedInstance));
        this.resolvedInstance = itemsDependencies.length>0
            ? this.wrappedInstance.apply(this.wrappedInstance, itemsDependencies)
            : this.wrappedInstance();
        invariant(this.resolvedInstance, this.name + ' instance must resolve in resolveInstance function')
    }

    getChildren(graph){
        this._children= [];
        fnArgs(this.wrappedInstance).forEach( d=> {
            var item =graph.findRequiredDependency(this.name, d);
            this._children.push(item);
        });
        return this._children.length > 0;
    }

    children(){
        return this._children;
    }

};