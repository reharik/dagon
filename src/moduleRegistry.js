/**
 * Created by rharik on 12/2/15.
 */
"use strict";

var RegistryDSL = require('./RegistryDSL');
var buildListofDependencies = require('./buildListofDependencies');
var invariant = require('invariant');
var logger = require('./logger');
var path = require('path');
var exceptionHandler = require('./exceptionHandler');
var _ = require('lodash');
module.exports =  function(registryFunc) {
    try {
        invariant(registryFunc && _.isFunction(registryFunc),
            'You must supply a registry function');

        var registry        = registryFunc(new RegistryDSL());
        var packageJson      = require(path.join(registry.pathToAppRoot, '/package.json'));
        var wrappedDependencies = buildListofDependencies(registry.dependencyDeclarations, registry.dependentRegistries, packageJson);
        return {
            dependencies: wrappedDependencies,
            overrides:registry.dependencyDeclarations
        }
    } catch (err) {
        throw exceptionHandler(err, 'Error collecting dependencies.  Check nested exceptions for more details.');
    }
};

