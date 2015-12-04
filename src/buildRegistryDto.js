/**
 * Created by reharik on 12/3/15.
 */

var wrapDependencies = require('./wrapDependencies');

module.exports = function buildRegistryDto(func) {
    var registry = func(new RegistryDSL());

    var wrappedDependencies = registry.dependencyDeclarations
        .filter(x=> registry.dependencyItems.every(i=>i.name != x.name))
        .map(x=> {
            return {
                name: x.name,
                internal: x.internal,
                instantiate: x.instantiate,
                path: x.path ? x.path : x.name,
                groupName: x.groupName

            }})
        .concat(registry.dependencyItems)
        .map(wrapDependencies);

    var overrides = registry.dependencyDeclarations
        .filter(x=> registry.dependencyItems.any(i=>i.name == x.name));

    return {
        wrappedDependencies,
        overrides,
        dependentRegistries: registry.dependentRegistries
    }
};
