/**
 * Created by rharik on 12/2/15.
 */
"use strict";

var RegistryDSL = require('./RegistryDSL');
var invariant = require('invariant');
var logger = require('./../logger');
var path = require('path');
var R = require('ramda');
var fs = require('fs');
var ono = require('ono');

var moduleRegistry = function(registryFunc) {

    try {
        invariant(registryFunc , //&& R.isFunction(registryFunc),
            'You must supply a registry function');

        var dto = registryFunc(new RegistryDSL());
        //dto.dependentRegistries.forEach(x=>{
        //    invariant(fs.existsSync(x), 'dependent registry '+fs.realpathSync(x)+' does not exist');
        //    console.log(fs.realpathSync(x));
        //    console.log(fs.existsSync(x));
        //});
        return dto.dependentRegistries.map(x=> require(x)())
            .reduce((m, a) => {
                a.dependencyDeclarations = a.dependencyDeclarations.concat(m.dependencyDeclarations);
                a.overrideDeclarations = a.overrideDeclarations.concat(m.overrideDeclarations);
                return a;
            },dto);

    } catch (err) {
        throw ono(err, 'Error collecting dependencies.  Check nested exceptions for more details.');
    }
};

module.exports = moduleRegistry;
