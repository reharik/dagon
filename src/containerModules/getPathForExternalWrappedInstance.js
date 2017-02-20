/**
 * Created by rharik on 1/3/16.
 */
"use strict";

var ono = require('ono');
var R = require('ramda');
var path = require('path');

var tryRequire = function(path){
    try{
        return require(path);
    }catch(ex){
        //swallow
    }
};

//this noise is necessary for npm 2.*. In 3.* all the deps ( usually ) are at the root level so not necessary
var recurseItemAltPath = function(path, name){
    if(!path || path === '/' + name){
        return undefined;
    }
    var tried = tryRequire(path);
    if(tried) {
        return path;
    } else {
        var preslugs = path.replace('node_modules/' + name,'');
        var slugs = preslugs.split('/');
        var trimmedSlugs = R.dropLastWhile(x=>x!='node_modules', slugs);
        var trimmedPath = trimmedSlugs.join('/') + '/' + name;
        return recurseItemAltPath(trimmedPath, name)
    }
};

module.exports =  function(item) {
    var path = tryRequire(item.path) ? item.path : recurseItemAltPath(item.altPath, item.path);

    if (!path) {
        throw ono([], 'unable to resolve dependency: ' + item.name + ' at either: ' + item.path + ' or: ' + item.altPath)
    }

    return path;
};