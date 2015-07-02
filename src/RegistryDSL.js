/**
 * Created by rharik on 6/24/15.
 */

var invariant = require('invariant');

module.exports = class RegistryDSL{
    constructor(){
        this._pathToPackageJson;
        this.dependencyDeclarations = [];
        this.renamedDeclarations = [];
        this._declarationInProgress;
        this._renameInProgress;
    }

    pathToPackageJson(path){
        invariant(path,'Path to package.json must be a valid path');
        this._pathToPackageJson = path;
        return this;
    }

    forDependencyParam(param){
        invariant(param,'You must provide a valid dependency parameter');
        this._declarationInProgress = {
            name: param
        };
        return this;
    }

    requireThisModule(path){
        invariant(path,'You must provide a valid replacement module');
        invariant(this._declarationInProgress,'You must call "forDependencyParam" before calling "requireThisModule"');
        this._declarationInProgress.path=path;
        this.dependencyDeclarations.push(this._declarationInProgress);
        this._declarationInProgress = null;
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
            pathToPackageJson:this._pathToPackageJson,
            dependencyDeclarations:this.dependencyDeclarations,
            renamedDeclarations:this.renamedDeclarations
        };
    }
};