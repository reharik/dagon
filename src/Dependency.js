/**
 * Created by rharik on 6/30/15.
 */

var invariant = require('invariant');

module.exports = class Dependency{
    constructor(name, path){
        this.name = name;
        this.path = path;
        invariant(this.name && this.name.length > 1, 'Dependency must have a valid name ' + this.name);
        invariant(this.path && this.path.length > 1,
            'Dependency ' + this.name + ' must have a valid path: '+this.path);

        this.wrappedInstance = require(path);
        this.resolvedInstance;
    }

    resolveInstance(graph){
        if(this.resolvedInstance){return;}
        var itemsDependencies = [];
        fnArgs(this.wrappedInstance).forEach(d=>  itemsDependencies.push(graph.findRequiredDependency(this.name, d).resolvedInstance));

        this.resolvedInstance = dependencies.length>0
            ? this.wrappedInstance.apply(this.wrappedInstance, itemsDependencies)
            : item.wrappedInstance();
    }

    getChildren(graph){
        var children = [];
        fnArgs(this.wrappedInstance).forEach( d=>  children.push(graph.findRequiredDependency(this.name, d)) );
        return children.length > 0 ? children : null;
    }

};