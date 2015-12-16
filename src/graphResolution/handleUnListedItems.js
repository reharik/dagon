/**
 * Created by rharik on 12/13/15.
 */

var logger = require('./logger');
var groupDependencies = require('./groupDependencies');
var requireDependencyOrThrow = require('./requireDependencyOrThrow');

module.exports = function handleUnListedItems(name, unResDeps, resolvedDependencies){
    if(!groupDependencies(name, unResDeps, resolvedDependencies)){
        requireDependencyOrThrow(name, resolvedDependencies);
    }
};
