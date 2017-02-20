/**
 * Created by rharik on 12/13/15.
 */
"use strict";

var logger = require('./../logger');
var JSON = require('JSON');
var ono = require('ono');

function instantiateClass(instanceFeatures, resolvedInstance) {
    logger.debug('instantiateInstance | instantiateClass: item is class so call new with constructor params if present');
    var result;
    if (instanceFeatures.parameters) {
        // var i  = Object.create(resolvedInstance.prototype);
        result  = Reflect.construct(resolvedInstance, instanceFeatures.parameters);
        // result = Object(r) === r ? r : i;
    } else {
        result = new resolvedInstance();
    }
    return result;
}

function instantiateFunc(instanceFeatures, resolvedInstance) {

    logger.debug('instantiateInstance | instantiateFunc: item is func so "call" or just call()');
    var result;
    if (instanceFeatures.parameters) {
        result = resolvedInstance.apply(resolvedInstance, instanceFeatures.parameters);
    } else {
        result = resolvedInstance();
    }

    return result;
}
function initialize(instanceFeatures, resolvedInstance) {
    logger.debug('instantiateInstance | initialize: item has an initialization method so call that with params if present');
    var result;
    if (instanceFeatures.initParameters) {
        result = resolvedInstance[instanceFeatures.initializationMethod].apply(resolvedInstance, instanceFeatures.initParameters);
    } else {
        result = resolvedInstance[instanceFeatures.initializationMethod]();
    }
    return instanceFeatures.dependencyType === 'class' ? resolvedInstance : result;
}

var instantiateResolvedInstance = function(instanceFeatures, resolvedInstance){
    logger.trace('instantiateInstance | instantiateResolvedInstance: instantiation features requested : '+ JSON.stringify(instanceFeatures));

    var instance;
    if(instanceFeatures.dependencyType === 'class'){
        instance = instantiateClass(instanceFeatures, resolvedInstance);
    }else if(instanceFeatures.dependencyType === 'func'){
        instance = instantiateFunc(instanceFeatures, resolvedInstance);
    }

    if(instanceFeatures.initializationMethod) {
        instance = initialize(instanceFeatures, instance ? instance : resolvedInstance);
    }
    return instance;
};

module.exports = function instantiateInstance(instanceFeatures, resolvedInstance){
    logger.trace('instantiateInstance | constructor: calling instantiateResolvedInstance to do post resolution modifications');
    try {
        return instantiateResolvedInstance(instanceFeatures, resolvedInstance);
    }catch(err){
        throw ono(err, 'Error attempting to instantiate resolved instance for item: ' + instanceFeatures.name);
    }
};