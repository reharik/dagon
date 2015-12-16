/**
 * Created by rharik on 12/13/15.
 */

var logger = require('./logger');

var fnArgs = require('fnargs');
var instantiateInstance = require('./instantiateInstance');

moduel.expose = function resolveItem(item, resolvedDependencies){
    var args = fnArgs(item.wrappedInstance);
    // possible null exception
    var resolvedArgs = args.map(x=> { return resolvedDependencies.find(d=>d.name == x).resolvedInstance });

    var resolvedInstance = resolvedArgs.length > 0
        ? item.wrappedInstance.apply(item.wrappedInstance, resolvedArgs)
        : item.wrappedInstance();

    if(resolvedInstance.instantiate){
        instantiateInstance(resolvedInstance);
    }

    return resolvedInstance;
};
