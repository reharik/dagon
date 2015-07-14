/**
 * Created by rharik on 6/24/15.
 */

var invariant = require('invariant');
var Dependency = require('./Dependency');
var path = require('path');
var fs = require('fs');
var appRoot = require('./appRoot');

module.exports = class RegistryDSL{
    constructor(){
        this._pathToPackageJson;
        this.dependencyDeclarations = [];
        this.renamedDeclarations = [];
        this._declarationInProgress;
        this._renameInProgress;
        this.appRoot;
    }

    pathToRoot(_path){
        appRoot.path = _path;
        this.appRoot = _path;
        var resolvedPath = path.join(this.appRoot, '/package.json');
        invariant(fs.existsSync(resolvedPath),'Path to package.json does not resolve: '+ path.resolve(resolvedPath));
        this._pathToPackageJson = resolvedPath;
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
            new Dependency({name:this._declarationInProgress.name, path:this._declarationInProgress.path, internal:isInternal, appRoot:this.appRoot}));
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
        invariant(this._pathToPackageJson, 'You must provide a path to your package.json before calling complete')

        return {
            appRoot: this.appRoot,
            pathToPackageJson:this._pathToPackageJson,
            dependencyDeclarations:this.dependencyDeclarations,
            renamedDeclarations:this.renamedDeclarations
        };
    }
};