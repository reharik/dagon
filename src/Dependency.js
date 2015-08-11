/**
 * Created by rharik on 6/30/15.
 */

var invariant = require('invariant');
var fnArgs = require('fn-args');
var _path = require('path');
var appRoot = require('./appRoot');
var JSON = require('JSON');
var logger = require('../src/yowlWrapper');
var _ = require('lodash');

module.exports = class Dependency{
    constructor(options){
        this.name = options.name;
        this.path = options.path;
        this.internal = options.internal || false;
        this.groupName = options.groupName || '';
        this.resolvedInstance = options.resolvedInstance;
        this.instantiate = options.instantiate;
        this._children;
        invariant(this.name, 'Dependency must have a valid name');
        invariant(this.path || this.resolvedInstance,
            'Dependency ' + this.name + ' must have a valid path: '+this.path);
        logger.trace('Dependency | constructor: Intialized with following properties: '+JSON.stringify(this));

        if(this.resolvedInstance){
            this.handleResolvedInstancePassedIn();
        }
        else if (this.internal) {
            this.handleInternalDependency();

        } else {
            this.handleExternalModule();
        }
    }

    resolveInstance(graph){
        logger.trace('Dependency | resolveInstance: resolving instance or returning if already resolved');
        if(this.resolvedInstance){return;}
        logger.trace('Dependency | getCollectionOfDependencies: calling getResolvedInstanceForCollectionOfDependencies');
        var itemsDependencies = this.getResolvedInstanceForCollectionOfDependencies(this.getCollectionOfDependencies(graph));
        this.resolvedInstance = this._instantiate(itemsDependencies);

        invariant(this.resolvedInstance, this.name + ' instance must resolve in resolveInstance function')
    }

    _instantiate(resolvedDependencies){
        logger.trace('Dependency | instantiate: actually resolving instances');
        logger.trace('Dependency | instantiate: if no dependencies just call wrappedInstance, otherwise apply function with dependencies');
        var parent = resolvedDependencies.length>0
            ? this.wrappedInstance.apply(this.wrappedInstance, resolvedDependencies)
            : this.wrappedInstance();
        if(this.instantiate){
            logger.trace('Dependency | instantiate: calling instantiateResolvedInstance to do post resolution modifications');
            return this.instantiateResolvedInstance(parent);  //parent.apply(parent, this.instantiateWith)
        }
        return parent;
    }

    instantiateResolvedInstance(resolved){
        if(this.instantiate.dependencyType == 'class'){
            logger.debug('Dependency | instantiateResolvedInstance: item is class so call new with constructor params if present');
            if(this.instantiate.parameters){
                var i = Object.create(resolved.prototype);
                var r = resolved.apply(i, this.instantiate.parameters);
                resolved = Object(r) === r? r : i
            }else{
                resolved = new resolved();
            }
        }
        if(this.instantiate.dependencyType == 'func'){
            logger.debug('Dependency | instantiateResolvedInstance: item is func so "call" or just call()');
            if(this.instantiate.parameters){
                resolved = resolved.call(resolved,this.instantiate.parameters);
            }else{
                resolved = resolved();
            }
        }
        if(this.instantiate.initializationMethod){
            logger.debug('Dependency | instantiateResolvedInstance: item has an initialization method so call that with params if present');
            if(this.instantiate.initParameters){
                resolved = resolved[this.instantiate.initializationMethod].apply(resolved[this.instantiate.initializationMethod],this.instantiate.initParameters)
            }else{
                resolved = resolved[this.instantiate.initializationMethod]()
            }
        }
        return resolved;

    }

    getCollectionOfDependencies(graph) {
        logger.trace('Dependency | getCollectionOfDependencies: getting args from wrapper function and finding instances in graph');
        var args = fnArgs(this.wrappedInstance);
        logger.trace('Dependency | getCollectionOfDependencies: args: ' + args);
        return args.map(d=> {
            var item = graph.findRequiredDependency(d);
            if (!item) {
                item = graph.findGroupedDependencies(d);
            }
            if (!item) {
                logger.debug('Dependency | getCollectionOfDependencies: can not find dependency: ' + d);
                logger.debug('Dependency | getCollectionOfDependencies: ' + graph._items.map(x=> x.name));
                invariant(false, 'Module ' + this.name + ' has a dependency that can not be resolved: ' + d);
            }
            return item;
        });
    }

    getResolvedInstanceForCollectionOfDependencies(dependencies){
        logger.trace('Dependency | getResolvedInstanceForCollectionOfDependencies: getting resolved instances recursively');
        var result = [];
        dependencies.forEach(x=> {
            if (Array.isArray(x)) {
                result.push(this.getResolvedInstanceForCollectionOfDependencies(x));
            }
            else{result.push(x.resolvedInstance);}
        });
        return result;
    }

    flatten(array) {
        return Array.isArray(array) ? [].concat.apply([], array.map(x=>this.flatten(x))||[]) : array;
    }

    getChildren(graph,caller){
        logger.debug('Dependency | getChildren: flattening out graph of dependencies');
        this._children = this.flatten(this.getCollectionOfDependencies(graph));
        logger.debug('Dependency | getChildren: has '+this._children.length+' children');
        return this._children.length > 0;
    }

    children(){
        return this._children;
    }

    handleResolvedInstancePassedIn() {
        logger.trace('Dependency | handleResolvedInstancePassedIn: reoslved instance passed so wrapping resolved instance in function');
        this.wrappedInstance = function(){return this.resolvedInstance;};
    }

    handleInternalDependency() {
        logger.trace('Dependency | handleInternalDependency: internal module so requiring item using path. no need to wrap in function ');
        var resolvedPath = _path.join(appRoot.path, this.path);
        //DANGER DANGER
        this.wrappedInstance = require(resolvedPath);
        invariant(_.isFunction(this.wrappedInstance),
        'Dependency | handleInternalDependency: dagon is unable to require the following dependency: '+this.name+' at this path: '+ resolvedPath)
    }

    handleExternalModule() {
        logger.trace('Dependency | handleExternalModule: external module so requiring item using path and wrapping in function ');
        this.wrappedInstance = fuehnction () {
            //DANGER DANGER
            return require(this.path);
        };
    }

};