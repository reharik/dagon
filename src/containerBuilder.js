/**
 * Created by reharik on 12/6/15.
 */


var ContainerDSL = require('./ContainerDSL');
var logger = require('./logger');
var exceptionHandler = require('./exceptionHandler');
var moduleRegistry = require('./moduleRegistry');
var R = require('ramda');

module.exports = function(registryFunc, containerFunc){

    var dto = moduleRegistry(registryFunc);

    var dependencies = R.uniqWith((a,b) => a.name == b.name, dto.dependencyDeclarations)
        .concat(dto.overrideDeclarations.filter(x=>!x.newName));

    var renames = R.filter(x=>x.newName, dto.overrideDeclarations);

    var rename = x=> {
        var clone  = R.clone(dependencies.find(d=>d.name == x.name));
        clone.name = x.newName;
        return clone;
    };
    //var result = R.concat(renames.map(f), dependencies);
    var dependencies = R.map(rename, renames);
    
    var instantiations = containerFunc(new InstantiateDSL(dependencies))

};
