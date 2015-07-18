/**
 * Created by rharik on 6/24/15.
 */

var invariant = require('invariant');
var Dependency = require('./Dependency');
var path = require('path');
var fs = require('fs');
var appRoot = require('./appRoot');
var helpers = require('./DSLHelpers');
module.exports = class RegistryDSL{
    constructor(){
        this._pathToPackageJson;
        this.dependencyDeclarations = [];
        this.renamedDeclarations = [];
        this._declarationInProgress;
        this._renameInProgress;
    }

    pathToRoot(_path){
        appRoot.path = _path;
        var resolvedPath = path.join(appRoot.path, '/package.json');
        invariant(fs.existsSync(resolvedPath),'Path to package.json does not resolve: '+ path.resolve(resolvedPath));
        this._pathToPackageJson = resolvedPath;
        return this;
    }

    requireDirectory(dir) {
        invariant(dir, 'You must provide a valid directory');
        var absoluteDir = path.join(appRoot.path, dir);
        fs.readdirSync(absoluteDir).filter(x=>x.endsWith('.js'))
            .forEach(x=> this.dependencyDeclarations.push(helpers.processFile(x, dir)));
        return this;
    }

    requireDirectoryRecursively(dir){
        invariant(dir,'You must provide a valid directory');
        var absoluteDir= path.join(appRoot.path, dir);
        helpers.recurseDirectories(absoluteDir).forEach(x=> this.dependencyDeclarations.push(x));
        return this;
    }

    groupAllInDirectory(dir, groupName){
        invariant(dir, 'You must provide a valid directory');
        invariant(groupName, 'You must provide a valid Group Name');
        var absoluteDir = path.join(appRoot.path, dir);
        fs.readdirSync(absoluteDir).filter(x=>x.endsWith('.js'))
            .forEach(x=> this.dependencyDeclarations.push(helpers.processFile(x, dir, groupName)));
        return this;
    }

    forDependencyParam(param){
        invariant(param,'You must provide a valid dependency parameter');
        this._declarationInProgress = {
            name: param
        };
        return this;
    }

    requireThisModule(path, isInternal){
        invariant(path,'You must provide a valid replacement module');
        invariant(this._declarationInProgress,'You must call "forDependencyParam" before calling "requireThisModule"');
        this._declarationInProgress.path=path;
        this.dependencyDeclarations.push(
            new Dependency({name:this._declarationInProgress.name, path:this._declarationInProgress.path, internal:isInternal}));
        this._declarationInProgress = null;
        return this;
    }

    requireThisInternalModule(_path){
        this.requireThisModule(_path ,true);
        return this;
    }

    replace(name){
        invariant(name, 'You must provide the name of the your dependency');
        this._renameInProgress = {oldName: name};
        return this;
    }

    withThis(name){
        invariant(name, 'You must provide the new name');
        invariant(this._renameInProgress,'You must call "replace" before calling "withThis"');
        this._renameInProgress.name = name;
        this.renamedDeclarations.push(this._renameInProgress);
        this._renameInProgress=null;
        return this;
    }

    complete(){
        return {
            pathToPackageJson:this._pathToPackageJson,
            dependencyDeclarations:this.dependencyDeclarations,
            renamedDeclarations:this.renamedDeclarations
        };
    }
};