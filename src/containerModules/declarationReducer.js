/**
 * Created by rharik on 1/3/16.
 */
"use strict";

var InstantiateDSL = require('./InstantiateDSL');
var moduleRegistry = require('./moduleRegistry');
var R = require('ramda');

module.exports = function(registryFunc, containerFunc) {

    var dto          = moduleRegistry(registryFunc);
    var dependencies = R.uniqWith((a, b) => a.name == b.name && a.groupName == b.groupName, dto.dependencyDeclarations)
        .concat(dto.overrideDeclarations.filter(x=>!x.newName && !x.replaceWith && !x.subWith));
    var renames = R.filter(x=>x.newName, dto.overrideDeclarations);
    var rename  = x=> {
        var clone  = R.clone(dependencies.find(d=>d.name == x.name));
       //shit's blowin up here. if the dep is not there for some reason
        if(!clone) {
            throw new ono(`Unable to find dependency named ${x.name} to rename with ${x.newName}`);
        }
        clone.name = x.newName;
        return clone;
    };

    var renamedDependencies = R.concat(R.map(rename, renames), dependencies);

    var replacements            = R.filter(x=>x.replaceWith, dto.overrideDeclarations);
    var replace                 = x=> {
        var clone  = R.clone(R.find(d => d.name == x.replaceWith, renamedDependencies));
        if(!clone) {
            throw new ono(`Unable to find dependency named ${x.name} to replace with ${x.replaceWith}`);
        }
        clone.name = x.name;
        return clone;

    };

    var substitutes            = R.filter(x=>x.subWith, dto.overrideDeclarations);
    var substitute               = x => {
        renamedDependencies = R.remove(R.findIndex(i => i.name === x.name, renamedDependencies),1, renamedDependencies);
        x.substitution = true;
        return x;

    };
    var filteredForReplacements = renamedDependencies.filter(x=> !replacements.some(s=>s.name === x.name));

    var replacedDependencies = R.concat(R.map(replace, replacements), filteredForReplacements);
    
    var finalDependencies = R.concat(R.map(substitute, substitutes), replacedDependencies);

    var instantiations = containerFunc ? containerFunc(new InstantiateDSL(finalDependencies)) : [];
    instantiations.forEach(x=> {
        var item         = finalDependencies.find(d=>d.name === x.name);
        item.instantiate = x
    });
    return finalDependencies;
};