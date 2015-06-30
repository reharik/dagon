/**
 * Created by rharik on 6/24/15.
 */

module.exports = class RegistryDSL{
    constructor(){
        this._pathToJsonConfig;
        this.dependencyDeclarations = [];
        this.renamedDeclarations = [];
        this.declarationInProcess;
        this.renameInProgress;
    }

    pathToJsonConfig(path){
        this._pathToJsonConfig = path;
        return this;
    }

    forDependencyParam(param){
        this.declarationInProcess ={
            name: param
        };
        return this;
    }

    requireThisModule(path){
        this.declarationInProcess.path=path;
        this.dependencyDeclarations.push(this.declarationInProcess);
        this.declarationInProcess = null;
        return this;
    }

    replace(name){
        this.renameInProgress = {oldName: name};
        return this;
    }

    withThis(name){
        this.renameInProgress.name = name;
        this.renamedDeclarations.push(this.renameInProgress);
        this.renameInProgress=null;
        return this;
    }

    complete(){
        return {
            pathToJsonConfig:this._pathToJsonConfig,
            dependencyDeclarations:this.dependencyDeclarations,
            renamedDeclarations:this.renamedDeclarations
        };
    }
};