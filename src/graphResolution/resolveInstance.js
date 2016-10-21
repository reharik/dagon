/**
 * Created by rharik on 12/13/15.
 */
"use strict";

var logger = require('./../logger');
var fnArgs = require('fn-args');

var groupDependencies = require('./groupDependencies');
var resolveItem = require('./resolveItem');
var requireDependencyOrThrow = require('./requireDependencyOrThrow');

var resolveGroup = function resolveGroup(unResDeps, resDeps, name){
    var groupedItems = resDeps.filter(x=> x.groupName === name);
    var unResGroupedItems = unResDeps.filter(x=> x.groupName === name && !groupedItems.some(s=>s.name === x.name));
    groupedItems = groupedItems.concat(unResGroupedItems);

    if(!groupedItems || groupedItems.length === 0){
        return false;
    }
    groupedItems.forEach(x=> resolveInstance(unResDeps, resDeps, x));
    groupDependencies(resDeps,name);
    return true;
};

var resolveInstance = function resolveInstance(unResDeps, resDeps, item){
    if(resDeps.find(x=>x.name === item.name && x.groupName === item.groupName) ){
        return;
    }
    if(item.json) {
        item.resolvedInstance = item.wrappedInstance;
        resDeps.push(item);
        return;
    }
    if(typeof item.wrappedInstance !== 'function'){
        throw new Error(`Item named ${item.name} is neither valid JSON nor a wrapped function`);
    }
    fnArgs(item.wrappedInstance).forEach(a=>{
        var resDep = resDeps.find(x=>x.name == a);
        if(!resDep) {
            var nextItem = unResDeps.find(x=>x.name == a);
            if (!nextItem) {
                if(!resolveGroup(unResDeps, resDeps, a)){
                    requireDependencyOrThrow(resDeps, a);
                }
            } else {
                resolveInstance(unResDeps, resDeps, nextItem);
            }
        }
    });

    item.resolvedInstance = resolveItem(resDeps, item);
    resDeps.push(item);
};

module.exports = resolveInstance;