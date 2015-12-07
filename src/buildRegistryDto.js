/**
 * Created by reharik on 12/3/15.
 */

var wrapDependencies = require('./wrapDependencies');
var RegistryDSL = require('./RegistryDSL');

module.exports = function buildRegistryDto(func) {
    var dependencies = registry
    return {
        dependencies,
        dependentRegistries: registry.dependentRegistries
    }
};
