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
    }

    pathToRoot(_path){
        appRoot.path = _path;
        var resolvedPath = path.join(appRoot.path, '/package.json');
        invariant(fs.existsSync(resolvedPath),'Path to package.json does not resolve: '+ path.resolve(resolvedPath));
        this._pathToPackageJson = resolvedPath;
        return this;
    }
    // all initial entry points complete in-progress operations.  This way we can chain methods for
    // operations, with out explicitly knowing if it's a terminal method.
    requireDirectory(dir) {
        invariant(dir, 'You must provide a valid directory');
        this.completeDependencyDeclaration();
        this.completeRename();
        var absoluteDir = path.join(appRoot.path, dir);
        fs.readdirSync(absoluteDir).filter(x=>x.endsWith('.js'))
            .forEach(x=> this.dependencyDeclarations.push(this.processFile(x, dir)));
        return this;
    }

    requireDirectoryRecursively(dir){
        invariant(dir,'You must provide a valid directory');
        this.completeDependencyDeclaration();
        this.completeRename();
        var absoluteDir= path.join(appRoot.path, dir);
        this.recurseDirectories(absoluteDir);
        return this;
    }

    groupAllInDirectory(dir, groupName){
        invariant(dir, 'You must provide a valid directory');
        invariant(groupName, 'You must provide a valid Group Name');
        this.completeDependencyDeclaration();
        this.completeRename();
        var absoluteDir = path.join(appRoot.path, dir);
        fs.readdirSync(absoluteDir).filter(x=>x.endsWith('.js'))
            .forEach(x=> this.dependencyDeclarations.push(this.processFile(x, dir, groupName)));
        return this;
    }


    for(param){
        invariant(param,'You must provide a valid dependency parameter');
        this.completeDependencyDeclaration();
        this.completeRename();
        this._declarationInProgress = this.dependencyDeclarations.find(x=>x.name == param) || { name: param };
        return this;
    }

    require(path){
        invariant(path,'You must provide a valid replacement module');
        invariant(this._declarationInProgress,'You must call "for" before calling "require"');
        this._declarationInProgress.path=path;
        if(path.startsWith('.') || path.includes('/')){
            this._declarationInProgress.internal=true;
        }
        this.completeDependencyDeclaration();
        return this;
    }



    rename(name){
        invariant(name, 'You must provide the name of the your dependency');
        this.completeDependencyDeclaration();
        this.completeRename();
        this._renameInProgress = {oldName: name};
        return this;
    }

    withThis(name){
        invariant(name, 'You must provide the new name');
        invariant(this._renameInProgress,'You must call "replace" before calling "withThis"');
        this._renameInProgress.name = name;
        this.completeRename();
        return this;
    }

    completeDependencyDeclaration() {
        if(this._declarationInProgress) {
            this.dependencyDeclarations.push(new Dependency(this._declarationInProgress));
            this._declarationInProgress = null;
        }
    }

    completeRename() {
        if(this._renameInProgress) {
            this.renamedDeclarations.push(this._renameInProgress);
            this._renameInProgress = null;
        }
    }

    callInitMethod(method, args){
        invariant(method, 'You must provide an init method to call');
        invariant(this._declarationInProgress,'You must call "for" before calling "callInitMethod"');
        this._declarationInProgress.initMethodAndArgs = {method:method, args:args};
        return this;
    }

    instantiateWith(val){
        invariant(val, 'You must provide parameters to instantiate with');
        invariant(this._declarationInProgress,'You must call "for" before calling "instantiateWith"');
        this._declarationInProgress.instantiateWith = val;
        return this;
    }

    recurseDirectories(dir) {
        return fs.readdirSync(dir).map(x=> {
            var stat = fs.statSync(dir + '/' + x);
            if (stat && stat.isDirectory()) {
                this.recurseDirectories(dir + '/' + x);
            }
            return x;
        })
        .filter(x=>x.endsWith('.js'))
        .map(x => this.processFile(x, dir))
        .forEach(x=> this.dependencyDeclarations.push(x));
    }

    processFile(file,dir, groupName){
        if(!file.endsWith('.js')){return;}
        file = file.replace('.js','');
        var path = dir.replace(appRoot.path,'')+'/'+file;
        return new Dependency({name: file, path: path, internal: true, groupName:groupName||''});
    }


    complete(){
        this.completeDependencyDeclaration();
        this.completeRename();

        return {
            pathToPackageJson:this._pathToPackageJson,
            dependencyDeclarations:this.dependencyDeclarations,
            renamedDeclarations:this.renamedDeclarations
        };
    }
};