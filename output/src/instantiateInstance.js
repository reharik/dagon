/**
 * Created by parallels on 9/8/15.
 */
'use strict';

var logger = require('./logger');
var invariant = require('invariant');
var exceptionHandler = require('./exceptionHandler');

function instantiateClass(instanceFeatures, resolvedItem) {
    logger.debug('instantiateInstance | instantiateClass: item is class so call new with constructor params if present');
    var result;
    if (instanceFeatures.parameters) {
        var i = Object.create(resolvedItem.prototype);
        var r = resolvedItem.apply(i, instanceFeatures.parameters);
        result = Object(r) === r ? r : i;
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
        result = resolvedItem[instanceFeatures.initializationMethod].apply(resolvedItem[instanceFeatures.initializationMethod], instanceFeatures.initParameters);
    } else {
        result = resolvedItem[instanceFeatures.initializationMethod]();
    }
    return result;
}

var instantiateResolvedInstance = function instantiateResolvedInstance(parent, resolvedItem) {
    var result;
    var instanceFeatures = parent.instantiate;
    logger.trace('instantiateInstance | instantiateResolvedInstance: instantiation features requested : ' + instanceFeatures);

    if (instanceFeatures.dependencyType === 'class') {
        result = instantiateClass(instanceFeatures, resolvedItem);
    } else if (instanceFeatures.dependencyType === 'func') {
        result = instantiateFunc(instanceFeatures, resolvedItem);
    }

    if (instanceFeatures.initializationMethod) {
        result = initialize(instanceFeatures, result ? result : resolvedItem);
    }
    return result;
};

module.exports = function instantiateInstance(item, resolvedDependencies) {
    var error;
    var resolvedItem;
    invariant(item, 'You must supply an item to instantiate.');
    invariant(item.wrappedInstance, 'You can not instantiate a dependency with no WrappedInstance. item: ' + item.name);
    invariant(resolvedDependencies, 'You must supply an array of dependencies even if its empty.');

    logger.trace('instantiateInstance | constructor: actually resolving instance for ' + item.name);
    logger.trace('instantiateInstance | constructor: if no dependencies just call wrappedInstance, otherwise apply function with dependencies');
    try {
        resolvedItem = resolvedDependencies.length > 0 ? item.wrappedInstance.apply(item.wrappedInstance, resolvedDependencies) : item.wrappedInstance();
    } catch (err) {
        error = exceptionHandler(err, 'Error attempting to instantiate wrapped instance.  Wrapped instance looks like this: ' + item.wrappedInstance.toString());
        error.details = { item: item, resolvedDependencies: resolvedDependencies };
        throw error;
    }
    if (item.instantiate) {
        logger.trace('instantiateInstance | constructor: calling instantiateResolvedInstance to do post resolution modifications');
        try {
            return instantiateResolvedInstance(item, resolvedItem);
        } catch (err) {
            error = exceptionHandler(err, 'Error attempting to instantiate resolved instance for item:' + item.name);
            error.details = { instantiationInstructions: item.instantiate, resolvedItem: resolvedItem.toString() };
            throw error;
        }
    }
    return resolvedItem;
};