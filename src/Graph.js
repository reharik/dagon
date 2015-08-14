/**
 * Created by rharik on 6/30/15.
 */

var invariant = require('invariant');
var Dependency = require('./Dependency');
var _ = require('lodash');
var logger = require('./yowlWrapper');

module.exports = class Graph{
    constructor(){
        this._items = [];
    }

    addItem(dependency){
        invariant(dependency,'You must provide a dependency to add');
        logger.trace('Graph | addItem: remove original if present');
        _.remove(this._items, x=>x.name == dependency.name);
        logger.trace('Graph | addItem: add new item');
        this._items.push(dependency);
    }

    _findItem(dependencyName){
        invariant(dependencyName, 'You must provide a dependency name to find');
        for(let i of this._items){
            logger.trace('Graph | findItem: '+dependencyName+' target :' + i.name);
            if(i.name === dependencyName){
                logger.trace('Graph | findItem: item found');
                return i;
            }
        }
        try {
            logger.trace('Graph | findItem: item NOT found, trying to require(dep)');
            var tryingRequire = require(dependencyName);
            if (tryingRequire) {
                logger.trace('Graph | findItem: require found item');
                logger.trace('Graph | findItem: adding it to graph');
                return new Dependency({name:dependencyName,resolvedInstance: tryingRequire},logger);
            }
        }catch(ex){
            logger.info('Graph | findItem: item was not found and require threw an error');
            logger.info('Graph | findItem: error' + ex);
            //swallow, just a hail mary to resolve
        }
    }

    findRequiredDependency(dependencyName) {
        var item = this._findItem(dependencyName);
        if(item){ return item; }
    }

    //TODO needs tests
    findGroupedDependencies(groupName, groupAsArray) {
        logger.trace('Graph | findGroupedDependencies: looping through items');
        if(!groupName.contains('_hash')|| groupAsArray){
            return buildGroupAsArray(groupName);
        }
        return buildGroupAsHash(groupName);
    }
    //TODO needs tests
    buildGroupAsHash(groupName) {
        groupName = groupName.replace('_hash','');
        var item = {};
        for(let i of this._items){
            logger.trace('Graph | findGroupedDependencies: looking for groupName: ' + groupName);
            logger.trace('Graph | findGroupedDependencies: item groupName: ' + i.groupName);
            if(i.groupName === groupName){
                logger.trace('Graph | findGroupedDependencies: found item in group: ' + i.name);
                item[i.name] = i;
            }
        }
        return item;
    }

    buildGroupAsArray(groupName) {
        groupName = groupName.replace('_array','');
        var item = [];
        for(let i of this._items){
            logger.trace('Graph | findGroupedDependencies: looking for groupName: ' + groupName);
            logger.trace('Graph | findGroupedDependencies: item groupName: ' + i.groupName);
            if(i.groupName === groupName){
                logger.trace('Graph | findGroupedDependencies: found item in group: ' + i.name);
                item.push(i);
            }
        }
        if(item.length>0){ return item; }
    }

    findDependency(type){
        var item = this._findItem(type);
        logger.trace('Graph | findDependency: returning resolved instance');
        if(item){ return item.resolvedInstance; }
    }

    mapItems(func){
        return this._items.map(func);
    }

    buildGraph(pjson){
        invariant(pjson,'You must provide a json object to build graph from');
        if(pjson.dependencies){
            logger.trace('Graph | buildGraph: reading package.json dependencies');
            Object.keys(pjson.dependencies).forEach(x=> {
                var name = this.normalizeName(x);
                this._items.push(new Dependency({name:name, path:x},logger));
            });
        }
        if(pjson.internalDependencies) {
            logger.trace('Graph | buildGraph: reading package.json internalDependencies');
            Object.keys(pjson.internalDependencies).forEach(x=> {
                var name = this.normalizeName(x);
                this._items.push(new Dependency({name:name, path:pjson.internalDependencies[x], internal:true},logger));
            });
        }
    }

    normalizeName(orig){
        var name = orig.replace(/-/g, '');
        name = name.replace(/\./g, '_');
        logger.trace('Graph | normalizeName: normalizing name: '+orig+'->'+name);
        return name;
    }


    items(){
        return this._items;
    }

};
