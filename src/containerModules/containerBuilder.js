/**
 * Created by reharik on 12/6/15.
 */


var InstantiateDSL = require('./InstantiateDSL');
var logger = require('./../logger');
var exceptionHandler = require('./../exceptionHandler');
var moduleRegistry = require('./moduleRegistry');
var R = require('ramda');
var path = require('path');

module.exports = function(registryFunc, containerFunc){

    var dto = moduleRegistry(registryFunc);
    var dependencies = R.uniqWith((a,b) => a.name == b.name, dto.dependencyDeclarations)
        .concat(dto.overrideDeclarations.filter(x=>!x.newName));

    var renames = R.filter(x=>x.newName, dto.overrideDeclarations);

    var rename = x=> {
        var clone  = R.clone(dependencies.find(d=>d.name == x.name));
        clone.name = x.newName;
        return clone;
    };

    var finalDependencies = R.concat(R.map(rename, renames), dependencies);

    var instantiations = containerFunc ? containerFunc(new InstantiateDSL(finalDependencies)) : [];
    instantiations.forEach(x=>{
        var item = finalDependencies.find(d=>d.name === x.name);
        item.instantiate = x
    });

    var tryRequire = function(path){
        var instance;
        try{
            instance = require(path);
        }catch(ex){
            //swallow
        }
        return instance;
    };

    var recurseItemAltPath = function(path, name){
        console.log('path')
        console.log(path)
        var b = path === '/' + name;
        if(!path || b){
            console.log('returning undefinde')
            return undefined;
        }
        var tried = tryRequire(path);
        if(tried) {
            console.log('returning tied')
            return tried;
        } else {
            var propertyName = 'node_modules/' + name;
            var preslugs = path.replace(propertyName,'');
            var slugs = preslugs.split('/');
            var trimmedSlugs = R.dropLastWhile(x=>x!='node_modules', slugs);
            var trimmedPath = trimmedSlugs.join('/') + '/' + name;
            return recurseItemAltPath(trimmedPath, name)
        }
    };

    // fuck we have to dig through this altPath recursively for all mf node_modules till we find this pig fucker
    var externalWrappedInstance = function(item) {
        return function() {
            var instance = tryRequire(item.path);

            if (!instance) {
                instance = recurseItemAltPath(item.altPath, item.path);
            }

            if(!instance) {
                throw exceptionHandler([], 'unable to resolve dependency: ' + item.name + ' at either: ' + item.path + ' or: ' + item.altPath)
            }
            return instance;
        };
    };


    var wrapInstances = function wrapInstances(item) {
        item.wrappedInstance = item.internal
            ? require(item.path)
            : externalWrappedInstance(item);
        return item;
    };

    finalDependencies.forEach(wrapInstances);

    return {
        dependencies: finalDependencies
    }

};
