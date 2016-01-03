/**
 * Created by reharik on 12/6/15.
 */


var InstantiateDSL = require('./InstantiateDSL');
var logger = require('./../logger');
var exceptionHandler = require('./../exceptionHandler');
var moduleRegistry = require('./moduleRegistry');
var R = require('ramda');

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

    var externalWrappedInstance = function(item) {
        return function() {
            var instance;
            try {
                instance = require(item.path);
            } catch (ex) {
                //swallow
            }

            if (!instance) {
                try {
                    instance = require(item.altPath);
                } catch (ex) {
                    //swallow
                }
            }

            if (!instance) {
                throw('unable to resolve dependency: ' + item.name + ' at either: ' + item.path + ' or: ' + item.altPath)
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
