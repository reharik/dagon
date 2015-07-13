/**
 * Created by rharik on 6/30/15.
 */

var invariant = require('invariant');
var Dependency = require('./Dependency');
var _ = require('lodash');

module.exports = class Graph{
    constructor(appRoot){
        this.appRoot = appRoot;
        this._items = [];
    }

    addItem(dependency){
        invariant(dependency,'You must provide a dependency to add');
        _.remove(this._items, x=>x.name == dependency.name);
        this._items.push(dependency);
    }

    _findItem(dependencyName){
        invariant(dependencyName, 'You must provide a dependency name to find');
        for(let i of this._items){
            if(i.name === dependencyName){
                return i;
            }
        }
        try {
            var tryingRequire = require(dependencyName);
            if (tryingRequire) {
                return new Dependency({name:dependencyName,resolvedInstance: tryingRequire, appRoot:this.appRoot});
            }
        }catch(ex){
            //swallow, just a hail mary to resolve
        }
    }

    findRequiredDependency(caller, dependency) {
        var item = this._findItem(dependency);
        if(item){ return item; }
        invariant(false, 'Module ' + caller + ' has a dependency that can not be resolved: ' + dependency);
    }

    findDependency(type){
        var item = this._findItem(type);
        if(item){ return item.resolvedInstance; }
    }

    mapItems(func){
        return this._items.map(func);
    }

    buildGraph(pjson){
        invariant(pjson,'You must provide a json object to build graph from');
        if(pjson.dependencies){
            Object.keys(pjson.dependencies).forEach(x=> {
                this._items.push(new Dependency({name:x.replace(/-/g, ''), path:x, appRoot:this.appRoot}));
            });
        }
        if(pjson.internalDependencies) {
            Object.keys(pjson.internalDependencies).forEach(x=> {
                this._items.push(new Dependency({name:x, path:pjson.internalDependencies[x], internal:true, appRoot:this.appRoot}));
            });
        }
    }

    items(){
        return this._items;
    }

};
