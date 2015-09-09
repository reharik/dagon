/**
 * Created by parallels on 9/8/15.
 */
var logger = require('./logwrapper');

function instantiateClass(instanceFeatures, resolvedItem) {
    logger.debug('Dependency | instantiateResolvedInstance: item is class so call new with constructor params if present');
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
    logger.debug('Dependency | instantiateResolvedInstance: item is func so "call" or just call()');
    var result;
    if (instanceFeatures.parameters) {
        result = resolvedItem.apply(resolvedItem, instanceFeatures.parameters);
    } else {
        result = resolvedItem();
    }
    return result;
}
function initialize(instanceFeatures, resolvedItem) {
    logger.debug('Dependency | instantiateResolvedInstance: item has an initialization method so call that with params if present');
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

module.exports = function(item, resolvedDependencies){
    logger.trace('Dependency | instantiate: actually resolving instances');
    logger.trace('Dependency | instantiate: if no dependencies just call wrappedInstance, otherwise apply function with dependencies');
    var resolvedItem = resolvedDependencies.length>0
        ? item.wrappedInstance.apply(item.wrappedInstance, resolvedDependencies)
        : item.wrappedInstance();
    if(item.instantiate){
        logger.trace('Dependency | instantiate: calling instantiateResolvedInstance to do post resolution modifications');
        return instantiateResolvedInstance(item, resolvedItem);  //parent.apply(parent, this.instantiateWith)
    }
    return resolvedItem;
};
