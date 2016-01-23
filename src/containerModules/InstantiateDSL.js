/**
 * Created by rharik on 6/24/15.
 */
"use strict";

var invariant = require('invariant');
var logger = require('./../logger');

module.exports = class InstantiateDSL {
    constructor(resolvedDepenedencies) {
        this._dependencies = [];
        this._resolvedDependencies = resolvedDepenedencies;
    }
    
    instantiate(name) {
        invariant(name, 'You must provide a name for the dependency to instantiate');
        invariant(this._resolvedDependencies.some(x=>x.name == name), 'There is no dependency name '+name+' declared to instantiate');
        logger.trace('InstantiateDSL | instantiate: building new instantiation');
        this.completeDependencyDeclaration();
        this._declarationInProgress = { name };
        return this;
    }
    
    asClass() {
         invariant(this._declarationInProgress && this._declarationInProgress.name,
            'You must provide a dependency name before calling asClass');
        logger.trace('InstantiateDSL | asClass');
        this._declarationInProgress.dependencyType = 'class';
        return this;
    }

    asFunc() {
         invariant(this._declarationInProgress.name,
            'You must provide a dependency name before calling asClass');
        logger.trace('InstantiateDSL | asFunc');
        this._declarationInProgress.dependencyType = 'func';
        return this;
    }

    withParameters(parameters) {
        invariant(this._declarationInProgress.dependencyType,
            'You must set dependency type before calling withParameters. e.g. asClass, asFunc');
        invariant(arguments[0], 'You must provide parameters when calling withParameters');
        logger.trace('InstantiateDSL | withParameters: putting parameters in array form if not or if object specified');
        if (!Array.isArray(arguments[0])) {
            var _params = [];
            Object.keys(arguments).forEach(x=> _params.push(arguments[x]));
            this._declarationInProgress.parameters = _params;
        } else {
            this._declarationInProgress.parameters = parameters;
        }
        return this;
    }

    initializeWithMethod(method) {
        invariant(method,
            'You must provide method to call for initilization');
        logger.trace('InstantiateDSL | initializeWithMethod: specifying dependency should be initialized with following method: '+method);
        this._declarationInProgress.initializationMethod = method;
        return this;
    }

    withInitParameters(params) {
        invariant(this._declarationInProgress.initializationMethod,
            'You must call initializeWithMethod before calling withInitParameters');
        invariant(params,
            'You must provide parameters when calling withInitParameters');
        logger.trace('InstantiateDSL | withInitParameters: specifying initialization should be passed parameter');
        logger.trace('InstantiateDSL | withInitParameters: putting parameters in array form if not or if object specified');
        if (!Array.isArray(arguments[0])) {
            var _params = [];
            Object.keys(arguments).forEach(x=> _params.push(arguments[x]));
            this._declarationInProgress.initParameters = _params;
        } else {
            this._declarationInProgress.initParameters = params;
        }
        return this;
    }
    
     completeDependencyDeclaration() {
        if(this._declarationInProgress) {
            this._dependencies = this._dependencies.concat([this._declarationInProgress]);
            this._declarationInProgress = null;
        }
    }

    complete(){
        this.completeDependencyDeclaration();
        return this._dependencies;
    }
};

