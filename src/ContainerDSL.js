/**
 * Created by rharik on 12/2/15.
 */

var invariant = require('invariant');
var path = require('path');
var fs = require('fs');
var InstantiateDSL = require('./containerModules/InstantiateDSL');
var logger = require('./logger');

module.exports = class ContainerDSL {
    constructor() {
        this._pathToAppRoot;
        this.dependencyDeclarations = [];
        this._declarationInProgress;
    }

    // some how collect all the registreis


    /**
     * @param function - create a function to define how you would like this object instantiated
     * @returns {this}
     */
    instantiate(func) {
        invariant(func, 'You must provide func for instanciation');
        invariant(this._declarationInProgress, 'You must call "for" before calling "instantiate"');
        logger.trace('RegistryDSL | instantiate: building new instantiationDSL func');
        this._declarationInProgress.instantiate = func(new InstantiateDSL(logger)).getOptions();
        return this;
    }
};