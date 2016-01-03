/**
 * Created by rharik on 1/3/16.
 */

var InstantiateDSL = require('./InstantiateDSL');
var moduleRegistry = require('./moduleRegistry');
var R = require('ramda');

module.exports = function(registryFunc, containerFunc) {

    var dto          = moduleRegistry(registryFunc);
    var dependencies = R.uniqWith((a, b) => a.name == b.name, dto.dependencyDeclarations)
        .concat(dto.overrideDeclarations.filter(x=>!x.newName && !x.replaceWith));

    var renames = R.filter(x=>x.newName, dto.overrideDeclarations);
    var rename  = x=> {
        var clone  = R.clone(dependencies.find(d=>d.name == x.name));
        clone.name = x.newName;
        return clone;
    };

    var renamedDependencies = R.concat(R.map(rename, renames), dependencies);

    var replacements            = R.filter(x=>x.replaceWith, dto.overrideDeclarations);
    var replace                 = x=> {
        var clone  = R.clone(R.find(d => d.name == x.replaceWith, renamedDependencies));
        clone.name = x.name;
        return clone;

    };
    var filteredForReplacements = renamedDependencies.filter(x=> !replacements.some(s=>s.name === x.name));

    var finalDependencies = R.concat(R.map(replace, replacements), filteredForReplacements);

    var instantiations = containerFunc ? containerFunc(new InstantiateDSL(finalDependencies)) : [];
    instantiations.forEach(x=> {
        var item         = finalDependencies.find(d=>d.name === x.name);
        item.instantiate = x
    });
    return finalDependencies;
};