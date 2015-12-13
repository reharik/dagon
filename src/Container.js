/**
 * Created by rharik on 6/23/15.
 */
var _ = require('lodash');
var RegistryDSL = require('./RegistryDSL');
var ContainerDSL = require('./ContainerDSL');
var containerBuilder = require('./containerBuilder');
var buildListofDependencies = require('./buildListofDependencies');
var graphResolution = require('./graphResolver');
var invariant = require('invariant');
var JSON = require('JSON');
var logger = require('./logger');
var path = require('path');
var exceptionHandler = require('./exceptionHandler');
var moduleRegistry = require('./moduleRegistry');

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
    var getArrayOfGroup = function(_grovar container upName){
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
            return dependency
        });
    };

    try {
        invariant(registryFunc && _.isFunction(registryFunc),
            'You must supply a registry function');

        logger.trace('Container | constructor : Building registry');
        unresolvedGrpah = containerBuilder(registryFunc, containerFunc);

        logger.trace('Container | constructor : resolve graph');
        resolvedGrpah = graphResolver(unresolvedGrpah);

        return {
            getInstanceOf,
            getArrayOfGroup,
            getHashOfGroup,
            whatDoIHave
        };
    }catch(err){
        throw exceptionHandler(err, 'Error building dependency graph.  Check nested exceptions for more details.');
    }
};

