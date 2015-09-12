/**
 * Created by rharik on 6/30/15.
 */

var invariant = require('invariant');
var logger = require('./logger');
var _ = require('lodash');
var extend = require('extend');
var path = require('path');

var buildDependency = function buildDependency(manualCreates) {
    return manualCreates.map(x=> {
            return {
                name: x.name,
                internal: x.internal,
                instantiate: x.instantiate,
                path: x.path ? x.path : x.name,
                groupName: x.groupName

            }})
};

var wrapInstances = function wrapInstances(item, pathToAppRoot) {
    logger.trace('buildListOfDependencies | wrapInstance: Wrapping module ' + item.name + ' requiring item using path ' + item.path + '.');
    item.wrappedInstance = item.internal
        ? require(path.join(pathToAppRoot, item.path))
        : function() { return require(item.path); };

    invariant(_.isFunction(item.wrappedInstance),
        'The following dependency: ' + item.name + ' at this path: ' + path.join(pathToAppRoot, item.path)+' is not a function');
    return item;
};

var updateDependency = function updateDependency(manualDeclarations, existingDeclaration) {

    manualDeclarations
        .filter(x=>x.name == existingDeclaration.name)
        .forEach(i=>{
            existingDeclaration.groupName   = i.groupName;
            existingDeclaration.name        = i.newName ? i.newName : existingDeclaration.name;
            existingDeclaration.path        = i.path ? i.path : existingDeclaration.path;
            existingDeclaration.internal    = i.internal ? i.internal : existingDeclaration.internal;
            existingDeclaration.instantiate = i.instantiate ? i.instantiate : existingDeclaration.instantiate;
        });
};

var normalizeName = function normalizeName(orig){
    var name = orig.replace(/-/g, '');
    name = name.replace(/\./g, '_');
    logger.trace('buildListOfDependencies | normalizeName: normalizing name: '+orig+'->'+name);
    return name;
};

var getDependenciesFromProjectJson = function getDependenciesFromProjectJson(pjson){
    if(!pjson){
        return [];
    }
    logger.trace('buildListOfDependencies | getDependenciesFromProjectJson: reading package.json dependencies');
    return Object.keys(pjson.dependencies)
        .map(x=> {return { name: normalizeName(x), path:x }});
};

module.exports = function buildListOfDependencies(manualDeclarations, pjson, pathToAppRoot) {

    logger.trace('buildListOfDependencies | constructor : get package.json');
    manualDeclarations = manualDeclarations || [];

    var result = getDependenciesFromProjectJson(pjson);
    // need to get these before we rename the pjson dependencies
    var manualCreates= manualDeclarations.filter(x=> result.find(i=>i.name == x.name) == null);
    result.forEach(x=> updateDependency(manualDeclarations, x));

    // could be problem if the registry has two declarations for one item.
    // maybe put check in registry so that doesn't happen
    result = result.concat(buildDependency(manualCreates));
    result.forEach(x=> wrapInstances(x, pathToAppRoot));
    return result;
};
