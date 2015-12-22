/**
 * Created by rharik on 12/13/15.
 */

var logger = require('./../logger');
var exceptionHandler = require('./../exceptionHandler');
var JSON = require('JSON');

function instantiateClass(instanceFeatures, resolvedInstance) {
    logger.debug('instantiateInstance | instantiateClass: item is class so call new with constructor params if present');
    var result;
    if (instanceFeatures.parameters) {
        var i  = Object.create(resolvedInstance.prototype);
        var r  = resolvedInstance.apply(i, instanceFeatures.parameters);
        result = Object(r) === r ? r : i;
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

var instantiateResolvedInstance = function(item){
    var instance;
    var instanceFeatures = item.instantiate;
    logger.trace('instantiateInstance | instantiateResolvedInstance: instantiation features requested : '+ JSON.stringify(instanceFeatures));

    if(instanceFeatures.dependencyType === 'class'){
        instance = instantiateClass(instanceFeatures, item.resolvedInstance);
    }else if(instanceFeatures.dependencyType === 'func'){
        instance = instantiateFunc(instanceFeatures, item.resolvedInstance);
    }

    if(instanceFeatures.initializationMethod){
        instance = initialize(instanceFeatures, instance?instance:item.resolvedInstance);
    }
    return item.resolvedInstance = instance;
};

module.exports = function instantiateInstance(item){
    logger.trace('instantiateInstance | constructor: calling instantiateResolvedInstance to do post resolution modifications');
    try {
        return instantiateResolvedInstance(item);
    }catch(err){
        var error = exceptionHandler(err,'Error attempting to instantiate resolved instance for item:' + item.name);
        error.details = {instantiationInstructions:item.instantiate, resolvedInstance:item.resolvedInstance.toString() };
        throw error;
    }
};