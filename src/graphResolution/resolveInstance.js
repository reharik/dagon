/**
 * Created by rharik on 12/13/15.
 */

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
    if(resDeps.find(x=>x.name === item.name && x.groupName === item.groupName)){
        return
    }
    //shit is blowin up if item.wrappedinstance is not a function for some reason
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