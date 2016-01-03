/**
 * Created by reharik on 12/6/15.
 */

var exceptionHandler = require('./../exceptionHandler');
var R = require('ramda');
var path = require('path');

module.exports = function(finalDependencies){

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
        if(!path || path === '/' + name){
            return undefined;
        }

        var tried = tryRequire(path);
        if(tried) {
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
