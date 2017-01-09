/**
 * Created by rharik on 6/24/15.
 */
"use strict";

var invariant = require('invariant');
var path = require('path');
var fs = require('fs');
var InstantiateDSL = require('./InstantiateDSL');
var logger = require('./../logger');

module.exports = class RegistryDSL{
    constructor(){
        this.dependentRegistries = [];
        this._pathToAppRoot;
        this.dependencyDeclarations = [];
        this.overrideDeclarations = [];
        this._declarationInProgress;
    }

    /**
     * @param path - the path to your package.json
     * @returns {this}
     */
    pathToRoot(_path){
        logger.trace('RegistryDSL | pathToRoot: setting path to root: '+_path);
        this._pathToAppRoot = _path;
        var resolvedPath = path.join(this._pathToAppRoot, '/package.json');
        logger.trace('RegistryDSL | pathToRoot: checking to see if package exists using abspath: '+resolvedPath);
        invariant(fs.existsSync(resolvedPath),'Path to package.json does not resolve: '+ path.resolve(resolvedPath));
        return this;
    }

    /**
     * @param moduleRegistries - an array of 'requireable' modules that return moduleRegistries
     * @returns {this}
     */
    requiredModuleRegistires(moduleRegistries){
        this.dependentRegistries = moduleRegistries;
        return this;
    }

    // all initial entry points complete in-progress operations.  This way we can chain methods for
    // operations, with out explicitly knowing if it's a terminal method.
    /**
     * @param dir - the directory with modules that you want to register
     * @returns {this}
     */
    requireDirectory(dir, acceptJson) {
        invariant(dir, 'You must provide a valid directory');
        logger.trace('RegistryDSL | requireDirectory: closing in process declarations and renames');
        var absoluteDir = path.join(this._pathToAppRoot, dir);
        logger.debug('RegistryDSL | requireDirectory: looping through files in directory, filtering for .js');
        var dependencies = fs.readdirSync(absoluteDir).filter(x=> x.endsWith('.js') || (acceptJson && x.endsWith('.json')))
          .map(x=> this.processFile(x, absoluteDir));
        this.addDependenciesToCollection(dependencies);
        return this;
    }

    /**
     * @param dir - the directory with modules that you want to register recursively
     * @returns {this}
     */
    requireDirectoryRecursively(dir){
        invariant(dir,'You must provide a valid directory');
        logger.trace('RegistryDSL | requireDirectoryRecursively: closing in process declarations and renames');
        var absoluteDir= path.join(this._pathToAppRoot, dir);
        this.recurseDirectories(absoluteDir);
        return this;
    }

    /**
     * @param dir - the directory with modules that you want to group together
     * @param groupName the name to group all the moduels under
     * @returns {this}
     */
    groupAllInDirectory(dir, _groupName, acceptJson){
        invariant(dir, 'You must provide a valid directory');
        logger.trace('RegistryDSL | groupAllInDirectory: closing in process declarations and renames');
        var groupName = _groupName || dir.split(path.sep).pop();
        var absoluteDir = path.join(this._pathToAppRoot, dir);
        logger.debug('RegistryDSL | requireDirectory: looping through files in directory, filtering for .js');
        var dependencies = fs.readdirSync(absoluteDir).filter(x=> x.endsWith('.js') || (acceptJson && x.endsWith('.json')))
          .map(x=> this.processFile(x, absoluteDir, groupName));
        this.addDependenciesToCollection(dependencies);
        return this;
    }

    /**
     * This opens a new dependency declaration.
     * @param name - the name of the dependency you are registering
     * @returns {this}
     */
    for(param){
        invariant(param,'You must provide a valid dependency parameter');
        logger.trace('RegistryDSL | for: closing in process declarations');
        this.completeDependencyDeclaration();
        logger.trace('RegistryDSL | for: beginning new dependency declaration ');
        this._declarationInProgress = { name: param };
        return this;
    }
    /**
     * This completes the open declaration.
     * @param path - the path of the dependency you are registering
     * @returns {this}
     */
    require(_path){
        invariant(_path,'You must provide a valid replacement module');
        invariant(this._declarationInProgress,'You must call "for" before calling "require"');
        this._declarationInProgress.path=_path;
        if(_path.startsWith('.') || _path.includes('/')){
            this._declarationInProgress.internal=true;
            this._declarationInProgress.path=path.join(this._pathToAppRoot,_path);
        }
        return this;
    }
    /**
     * This completes the open declaration.
     * @param item - item to replace the declaration named in the 'for' with
     * @returns {this}
     */
    subWith(item){
        invariant(item,'You must provide a valid replacement module');
        invariant(this._declarationInProgress,'You must call "for" before calling "replaceWith"');
        this._declarationInProgress.subWith = item;
        return this;
    };

    /**
     * This completes the open declaration.
     * @param name - name of the existing declaration to replace the declaration named in the 'for' with
     * @returns {this}
     */
    replaceWith(name){
        invariant(name,'You must provide a valid replacement module');
        invariant(this._declarationInProgress,'You must call "for" before calling "replaceWith"');
        this._declarationInProgress.replaceWith = name;
        return this;
    };
    
    /**
     * This opens a new dependency declaration.
     * @param name - the original name of the dependency you are renaming
     * @returns {this}
     */
    renameTo(name){
        invariant(name, 'You must provide the NEW name for your dependency');
        invariant(this._declarationInProgress,'You must call "for" before calling "renameTo"');
        logger.trace('RegistryDSL | rename: renaming');
        this._declarationInProgress.newName = name;
        return this;
    }

    completeDependencyDeclaration() {
        if(this._declarationInProgress) {
            this.addOverrideToCollection(this._declarationInProgress);
            this._declarationInProgress = null;
        }
    }


    recurseDirectories(dir, acceptJson) {
        logger.trace('RegistryDSL | recurseDirectories: looping through '+dir);
        var dependencies = fs.readdirSync(dir).map(x=> {
            var stat = fs.statSync(dir + '/' + x);
            if (stat && stat.isDirectory()) {
                this.recurseDirectories(dir + '/' + x);
            }
            return x;
        })
        .filter(x=> x.endsWith('.js') || (acceptJson && x.endsWith('.json')))
          .map(x => this.processFile(x, dir));
        this.addDependenciesToCollection(dependencies);
    }

    processFile(file,dir, groupName){
        logger.trace('RegistryDSL | processFile: creating dependency object');
        var fileName = file.substr(0, file.lastIndexOf('.'));
        var path = dir + '/'+fileName;
        var name = this.normalizeName(fileName);
        logger.trace('RegistryDSL | processFile: properties -' + name +' -'+path+' -'+groupName);
        return {name: name, path: path, internal: true, groupName:groupName||'', json:file.endsWith('json')};
    }

    // not great that this is here and graph
    normalizeName(orig){
        var name = orig.replace(/-/g, '');
        name = name.replace(/\./g, '_');
        logger.trace('Graph | normalizeName: normalizing name: '+orig+'->'+name);
        return name;
    }

    getDependenciesFromProjectJson(){
        if(!this._pathToAppRoot){
            return [];
        }
        logger.trace('buildListOfDependencies | getDependenciesFromProjectJson: reading package.json dependencies');
        var packageJson      = require(path.join(this._pathToAppRoot, '/package.json'));
        var dependencies =  Object.keys(packageJson.dependencies)
          .map(x=> {return { name: this.normalizeName(x), path:x, altPath: this._pathToAppRoot + '/node_modules/' + x }});
        this.addDependenciesToCollection(dependencies);
    };

    addDependenciesToCollection(_items){
        var items = _items;
        if(!Array.isArray(items)){
            items = [_items];
        }

        this.dependencyDeclarations = this.dependencyDeclarations.concat(items);
    };

    addOverrideToCollection(_items){
        var items = _items;
        if(!Array.isArray(items)){
            items = [_items];
        }
        this.overrideDeclarations = this.overrideDeclarations.concat(items);
    };

    complete(){
        this.completeDependencyDeclaration();
        this.getDependenciesFromProjectJson();

        var dependencies = this.dependencyDeclarations.map(x=> {
            x.path = x.path ? x.path : x.name;
            return x;
        });

        return {
            overrideDeclarations: this.overrideDeclarations,
            dependencyDeclarations: dependencies || [],
            dependentRegistries   : this.dependentRegistries || []
        };
    }
};
