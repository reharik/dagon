/**
 * Created by rharik on 12/13/15.
 */
"use strict";

var logger = require('./../logger');
var invariant = require('invariant');

var resolveInstance = require('./resolveInstance');

module.exports = function resolveGraph(unResDeps){
    var resolvedDependencies = [];
    unResDeps.forEach(x=> resolveInstance(unResDeps, resolvedDependencies, x));
    return resolvedDependencies;
};
