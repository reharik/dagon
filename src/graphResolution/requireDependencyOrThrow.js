/**
 * Created by rharik on 12/13/15.
 */
"use strict";

var logger = require('./../logger');
var ono = require('ono');

module.exports = function requireDependencyOrThrow(resDeps, dependencyName) {
    try {
        var tryingRequire = require(dependencyName);
        if (tryingRequire) {
            resDeps.push( {
                name            : dependencyName,
                resolvedInstance: tryingRequire,
                wrappedInstance : function() { return tryingRequire; }
            });
        }
    } catch (ex) {
        logger.info('getDependency | tryRequireDependency: item was not found and require threw an error');
        logger.info('getDependency | tryRequireDependency: error' + ex);
        throw ono(ex,'item was not found and require threw an error: ' + dependencyName);
    }
};
