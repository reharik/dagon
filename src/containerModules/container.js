/**
 * Created by rharik on 6/23/15.
 */
"use strict";

var containerBuilder = require('./createWrappedInstances');
var declarationReducer = require('./declarationReducer');
var graphResolver = require('./../graphResolution/graphResolver');
var invariant = require('invariant');
var logger = require('./../logger');
var ono = require('ono');

module.exports = function container(registryFunc, containerFunc){

    var unresolvedGrpah = [];
    var resolvedGrpah = [];
    /**
     *
     * @param type - the type of dependency you want to get
     * @returns {type}
     */
    var getInstanceOf = function(_type) {
        var item = resolvedGrpah.find(x=>x.name == _type);
        return item  ? item.resolvedInstance : null;
    };

    /**
     *
     * @param groupName - the groupName of dependencies you want to get
     * @returns {type}
     */
    var getArrayOfGroup = function(_groupName){
        return resolvedGrpah.filter(x=>x.groupName == _groupName).map(x=> x.resolvedInstance);
    };

    var getHashOfGroup = function(_groupName) {
        var group = getArrayOfGroup(_groupName);
        var hash = {};
        group.forEach(x=> hash[x.name] = x);
        return hash;
    };

    /**
     *
     * @param type - return graph of all registered dependencies
     * @returns {json}
     */
    var whatDoIHave = function(_options) {
        var options = _options || {};
        return resolvedGrpah.map(x=>{
            var dependency = {name: x.name};
            if(options.showResolved) { dependency.resolvedInstance = x.resolvedInstance ;}
            if(options.showWrappedInstance) { dependency.wrappedInstance = x.wrappedInstance;}
            if(options.showAll) { dependency = x;}
            return dependency
        });
    };

    try {
        invariant(registryFunc, //&& _.isFunction(registryFunc),
            'You must supply a registry function');
        logger.trace('Container | constructor : Building registry');
        var finalDeclarations = declarationReducer(registryFunc, containerFunc);
        unresolvedGrpah = containerBuilder(finalDeclarations);

        logger.trace('Container | constructor : resolve graph');
        resolvedGrpah = graphResolver(unresolvedGrpah.dependencies);

        return {
            getInstanceOf,
            getArrayOfGroup,
            getHashOfGroup,
            whatDoIHave
        };
    }catch(err){
        throw ono(err, 'Error building dependency graph.  Check nested exceptions for more details.');
    }
};

