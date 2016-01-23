/**
 * Created by reharik on 12/6/15.
 */
"use strict";

var getPathForExternalWrappedInstance = require('./getPathForExternalWrappedInstance');

module.exports = function(finalDependencies){

    var wrapInstances = function wrapInstances(item) {

        if (item.internal) {
            item.wrappedInstance = require(item.path);
        } else {
            var path = getPathForExternalWrappedInstance(item);
            item.wrappedInstance = function() {
                return require(path);
            };
        }
        return item;
    };

    finalDependencies.forEach(wrapInstances);

    return {
        dependencies: finalDependencies
    }

};
