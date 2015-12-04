/**
 * Created by rharik on 12/2/15.
 */
"use strict";

var RegistryDSL = require('./RegistryDSL');
var buildRegistryDto = require('./buildRegistryDto');
var invariant = require('invariant');
var logger = require('./logger');
var path = require('path');
var exceptionHandler = require('./exceptionHandler');
var _ = require('lodash');


var moduleRegistry = function(registryFunc) {

    try {
        invariant(registryFunc && _.isFunction(registryFunc),
            'You must supply a registry function');

        var dto = buildRegistryDto(registryFunc);

        // this may return the initiating value ( dto ) if there are no dependentRegistries.
        // or it may blow the fuck up

        // there's something wrong here,but I"m too tired to see it
        return dto.dependentRegistries.map(x=> require(x)())
            .reduce((m, a) => {
                a.wrappedDependencies.concat(registry.wrappedDependencies);
                a.overrides.concat(registry.overrides);
                return a;
            },dto);

    } catch (err) {
        throw exceptionHandler(err, 'Error collecting dependencies.  Check nested exceptions for more details.');
    }
};

