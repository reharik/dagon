/**
 * Created by rharik on 12/13/15.
 */

var logger = require('./../logger');
var resolveInstance = require('./resolveInstance');

module.exports = function groupDependencies(name, unResDeps, resolvedDependencies){
    var groupedItems = unResDeps.filter(x=>groupName === name);
    if(!groupedItems || groupedItems.length === 0){
        return false;
    }
    groupedItems.forEach(x=> resolveInstance(x, unResDeps, resolvedDependencies));
    return true;
};