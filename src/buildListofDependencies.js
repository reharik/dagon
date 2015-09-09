/**
 * Created by rharik on 6/30/15.
 */

var invariant = require('invariant');
var logger = require('./logwrapper');

var buildDependency = function buildDependency(dependencyDeclarations, result) {
    return dependencyDeclarations
        .filter(x=> result.every(g=>g.name != x.name))
        .map(x=> {
            return {
                groupName,
                name,
                internal,
                instantiate,
                path: x.path ? x.path : x.name
            }})
};

var wrapInstances = function wrapInstances(x) {
    logger.trace('wrapDependency | wrapDependency: module ' + x.name + ' so requiring item using path ' + x.path + '.');
    x.wrappedInstance = x.internal
        ? require(x.path)
        : function() { require(x.path); };

    invariant(_.isFunction(x.wrappedInstance),
        'wrapDependency | wrapDependency: dagon is unable to require the following dependency: ' + x.name + ' at this path: ' + x.path);
    return x;
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
    logger.trace('Graph | normalizeName: normalizing name: '+orig+'->'+name);
    return name;
};

var getDependenciesFromProjectJson = function getDependenciesFromProjectJson(pjson){
    logger.trace('Graph | buildGraph: reading package.json dependencies');
    return Object.keys(pjson.dependencies)
        .map(x=> { name: normalizeName(x), path:x });
};

module.exports = function(manualDeclarations, pjson) {
    invariant(pjson, 'You must provide a json object to build graph from');
    invariant(registry, 'Must provide a registry');
    invariant(projectDeclarations,'Must provide a list of projectDeclarations');

    var result = getDependenciesFromProjectJson(pjson)
        .map(x=>updateDependency(manualDeclarations, x));

    // could be problem if the registry has two declarations for one item.
    // maybe put check in registry so that doesn't happen
    result.concat(buildDependency(manualDeclarations, result))
        .map(x=> wrapInstances(x));

    return result;
};
