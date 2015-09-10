/**
 * Created by parallels on 9/8/15.
 */
var logger = require('./logger');

function instantiateClass(instanceFeatures, resolvedItem) {
    logger.debug('instantiateInstance | instantiateClass: item is class so call new with constructor params if present');
    var result;
    if (instanceFeatures.parameters) {
        var i  = Object.create(resolvedItem.prototype);
        var r  = resolvedItem.apply(i, instanceFeatures.parameters);
        result = Object(r) === r ? r : i
    } else {
        result = new resolvedItem();
    }
    return result;
}

function instantiateFunc(instanceFeatures, resolvedItem) {
    logger.debug('instantiateInstance | instantiateFunc: item is func so "call" or just call()');
    var result;
    if (instanceFeatures.parameters) {
        result = resolvedItem.apply(resolvedItem, instanceFeatures.parameters);
    } else {
        result = resolvedItem();
    }
    return result;
}
function initialize(instanceFeatures, resolvedItem) {
    logger.debug('instantiateInstance | initialize: item has an initialization method so call that with params if present');
    var result;
    if (instanceFeatures.initParameters) {
        result = resolvedItem[instanceFeatures.initializationMethod].apply(resolvedItem[instanceFeatures.initializationMethod], instanceFeatures.initParameters)
    } else {
        result = resolvedItem[instanceFeatures.initializationMethod]()
    }
    return result;
}

var instantiateResolvedInstance = function(parent, resolvedItem){
    var result;
    var instanceFeatures = parent.instantiate;
    logger.trace('instantiateInstance | instantiateResolvedInstance: instantiation features requested : '+ instanceFeatures);

    if(instanceFeatures.dependencyType == 'class'){
        result = instantiateClass(instanceFeatures, resolvedItem);
    }else if(instanceFeatures.dependencyType == 'func'){
        result = instantiateFunc(instanceFeatures, resolvedItem);
    }

    if(instanceFeatures.initializationMethod){
        result = initialize(instanceFeatures, resolvedItem);
    }
    return result;
};

module.exports = function instantiateInstance(item, resolvedDependencies){
    logger.trace('instantiateInstance | constructor: actually resolving instance for '+ item.name);
    logger.trace('instantiateInstance | constructor: if no dependencies just call wrappedInstance, otherwise apply function with dependencies');
    var resolvedItem = resolvedDependencies.length>0
        ? item.wrappedInstance.apply(item.wrappedInstance, resolvedDependencies)
        : item.wrappedInstance();

    if(item.instantiate){
        logger.trace('instantiateInstance | constructor: calling instantiateResolvedInstance to do post resolution modifications');
        return instantiateResolvedInstance(item, resolvedItem);
    }
    return resolvedItem;
};
