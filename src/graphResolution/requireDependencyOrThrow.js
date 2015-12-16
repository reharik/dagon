/**
 * Created by rharik on 12/13/15.
 */

var logger = require('./logger');
var exceptionHandler = require('./exceptionHandler');

module.epxorts = function requireDependencyOrThrow(dependencyName, resDeps) {
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
        error = exceptionHandler(err,'item was not found and require threw an error:' + dependencyName);
        throw error;
    }
};
