/**
 * Created by rharik on 6/30/15.
 */

var invariant = require('invariant');
var logger = require('./logger');
var _ = require('lodash');
var extend = require('extend');
var appRoot = require('./appRoot');
var path = require('path');

var buildDependency = function buildDependency(dependencyDeclarations, result) {
    return dependencyDeclarations
        .filter(x=> result.every(g=>g.name != x.name))
        .map(x=> {
            return {
                name: x.name,
                internal: x.internal,
                instantiate: x.instantiate,
                path: x.path ? x.path : x.name,
                groupName: x.groupName

            }})
};

var wrapInstances = function wrapInstances(item) {
    logger.trace('buildListOfDependencies | wrapInstance: Wrapping module ' + item.name + ' requiring item using path ' + item.path + '.');
    item.wrappedInstance = item.internal
        ? require(path.join(appRoot.path, item.path))
        : function() { return require(item.path); };

    invariant(_.isFunction(item.wrappedInstance),
        'buildListOfDependencies | wrapInstance: The following dependency: ' + item.name + ' at this path: ' + path.join(appRoot.path, item.path)+' is not a function');
    return item;
};

var updateDependency = function updateDependency(dependencyDeclarations, x) {
    dependencyDeclarations
        .filter(d => d.name == x.name)
        .forEach(d=> {
            x.groupName   = d.groupName;
            x.name        = d.newName ? d.newName : x.name;
            x.path        = d.path ? d.path : x.path;
            x.internal    = d.internal ? d.internal : x.internal;
            x.instantiate = d.instantiate ? d.instantiate : x.instantiate;
        });
    return x;
};

var normalizeName = function normalizeName(orig){
    var name = orig.replace(/-/g, '');
    name = name.replace(/\./g, '_');
    logger.trace('buildListOfDependencies | normalizeName: normalizing name: '+orig+'->'+name);
    return name;
};

var getDependenciesFromProjectJson = function getDependenciesFromProjectJson(pjson){
    logger.trace('buildListOfDependencies | getDependenciesFromProjectJson: reading package.json dependencies');
    return Object.keys(pjson.dependencies)
        .map(x=> {return { name: normalizeName(x), path:x }});
};

module.exports = function buildListOfDependencies(manualDeclarations, pjson) {
    invariant(pjson, 'You must provide a json object to build graph from');
    invariant(manualDeclarations,'Must provide a list of manualDeclarations');

    var result = getDependenciesFromProjectJson(pjson)
        .map(x=>updateDependency(manualDeclarations, x));

    // could be problem if the registry has two declarations for one item.
    // maybe put check in registry so that doesn't happen
    return result.concat(buildDependency(manualDeclarations, result))
        .map(x=> wrapInstances(x));
};
