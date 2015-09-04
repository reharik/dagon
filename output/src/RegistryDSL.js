/**
 * Created by rharik on 6/24/15.
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var invariant = require('invariant');
var Dependency = require('./Dependency');
var path = require('path');
var fs = require('fs');
var appRoot = require('./appRoot');
var InstantiateDSL = require('./InstantiateDSL');
var logger = require('./yowlWrapper');

module.exports = (function () {
    function RegistryDSL() {
        _classCallCheck(this, RegistryDSL);

        this._pathToPackageJson;
        this.dependencyDeclarations = [];
        this._declarationInProgress;
    }

    /**
     * @param path - the path to your package.json
     * @returns {this}
     */

    _createClass(RegistryDSL, [{
        key: 'pathToRoot',
        value: function pathToRoot(_path) {
            logger.trace('RegistryDSL | pathToRoot: setting path to root: ' + _path);
            appRoot.path = _path;
            var resolvedPath = path.join(appRoot.path, '/package.json');
            logger.trace('RegistryDSL | pathToRoot: checking to see if package exists using abspath: ' + resolvedPath);
            invariant(fs.existsSync(resolvedPath), 'Path to package.json does not resolve: ' + path.resolve(resolvedPath));
            this._pathToPackageJson = resolvedPath;
            return this;
        }

        // all initial entry points complete in-progress operations.  This way we can chain methods for
        // operations, with out explicitly knowing if it's a terminal method.
        /**
         * @param dir - the directory with modules that you want to register
         * @returns {this}
         */
    }, {
        key: 'requireDirectory',
        value: function requireDirectory(dir) {
            var _this = this;

            invariant(dir, 'You must provide a valid directory');
            logger.trace('RegistryDSL | requireDirectory: closing in process declarations and renames');
            this.completeDependencyDeclaration();
            var absoluteDir = path.join(appRoot.path, dir);
            logger.debug('RegistryDSL | requireDirectory: looping through files in directory, filtering for .js');
            fs.readdirSync(absoluteDir).filter(function (x) {
                return x.endsWith('.js');
            }).forEach(function (x) {
                return _this.dependencyDeclarations.push(_this.processFile(x, dir));
            });
            return this;
        }

        /**
         * @param dir - the directory with modules that you want to register recursively
         * @returns {this}
         */
    }, {
        key: 'requireDirectoryRecursively',
        value: function requireDirectoryRecursively(dir) {
            invariant(dir, 'You must provide a valid directory');
            logger.trace('RegistryDSL | requireDirectoryRecursively: closing in process declarations and renames');
            this.completeDependencyDeclaration();
            var absoluteDir = path.join(appRoot.path, dir);
            this.recurseDirectories(absoluteDir);
            return this;
        }

        /**
         * @param dir - the directory with modules that you want to group together
         * @param groupName the name to group all the moduels under
         * @returns {this}
         */
    }, {
        key: 'groupAllInDirectory',
        value: function groupAllInDirectory(dir, _groupName) {
            var _this2 = this;

            invariant(dir, 'You must provide a valid directory');
            logger.trace('RegistryDSL | groupAllInDirectory: closing in process declarations and renames');
            var groupName = _groupName || dir.split(path.sep).pop();
            this.completeDependencyDeclaration();
            var absoluteDir = path.join(appRoot.path, dir);
            logger.debug('RegistryDSL | requireDirectory: looping through files in directory, filtering for .js');
            fs.readdirSync(absoluteDir).filter(function (x) {
                return x.endsWith('.js');
            }).forEach(function (x) {
                return _this2.dependencyDeclarations.push(_this2.processFile(x, dir, groupName));
            });
            return this;
        }

        /**
         * This opens a new dependency declaration.
         * @param name - the name of the dependency you are registering
         * @returns {this}
         */
    }, {
        key: 'for',
        value: function _for(param) {
            invariant(param, 'You must provide a valid dependency parameter');
            logger.trace('RegistryDSL | for: closing in process declarations');
            this.completeDependencyDeclaration();
            logger.trace('RegistryDSL | for: beginning new dependency declaration ');
            this._declarationInProgress = this.dependencyDeclarations.find(function (x) {
                return x.name == param;
            }) || { name: param };
            return this;
        }

        /**
         * This completes the open declaration.
         * @param path - the path of the dependency you are registering
         * @returns {this}
         */
    }, {
        key: 'require',
        value: function require(path) {
            invariant(path, 'You must provide a valid replacement module');
            invariant(this._declarationInProgress, 'You must call "for" before calling "require"');
            this._declarationInProgress.path = path;
            if (path.startsWith('.') || path.includes('/')) {
                this._declarationInProgress.internal = true;
            }
            return this;
        }

        /**
         * This opens a new dependency declaration.
         * @param name - the original name of the dependency you are renaming
         * @returns {this}
         */
    }, {
        key: 'renameTo',
        value: function renameTo(name) {
            invariant(name, 'You must provide the NEW name for your dependency');
            invariant(this._declarationInProgress, 'You must call "for" before calling "require"');
            logger.trace('RegistryDSL | rename: renaming');
            this._declarationInProgress.newName = name;
            return this;
        }
    }, {
        key: 'completeDependencyDeclaration',
        value: function completeDependencyDeclaration() {
            if (this._declarationInProgress) {
                this.dependencyDeclarations.push(this._declarationInProgress);
                this._declarationInProgress = null;
            }
        }

        /**
         * @param function - create a function to define how you would like this object instantiated
         * @returns {this}
         */
    }, {
        key: 'instantiate',
        value: function instantiate(func) {
            invariant(func, 'You must provide func for instanciation');
            invariant(this._declarationInProgress, 'You must call "for" before calling "instantiate"');
            logger.trace('RegistryDSL | instantiate: building new instantiationDSL func');
            this._declarationInProgress.instantiate = func(new InstantiateDSL(logger)).getOptions();
            return this;
        }
    }, {
        key: 'recurseDirectories',
        value: function recurseDirectories(dir) {
            var _this3 = this;

            logger.trace('RegistryDSL | recurseDirectories: looping through ' + dir);
            return fs.readdirSync(dir).map(function (x) {
                var stat = fs.statSync(dir + '/' + x);
                if (stat && stat.isDirectory()) {
                    _this3.recurseDirectories(dir + '/' + x);
                }
                return x;
            }).filter(function (x) {
                return x.endsWith('.js');
            }).map(function (x) {
                return _this3.processFile(x, dir);
            }).forEach(function (x) {
                return _this3.dependencyDeclarations.push(x);
            });
        }
    }, {
        key: 'processFile',
        value: function processFile(file, dir, groupName) {
            logger.trace('RegistryDSL | processFile: creating dependency object');
            if (!file.endsWith('.js')) {
                return;
            }
            file = file.replace('.js', '');
            var path = dir.replace(appRoot.path, '') + '/' + file;
            var name = this.normalizeName(file);
            logger.trace('RegistryDSL | processFile: properties -' + name + ' -' + path + ' -' + groupName);
            return new Dependency({ name: name, path: path, internal: true, groupName: groupName || '' }, logger);
        }

        // not great that this is here and graph
    }, {
        key: 'normalizeName',
        value: function normalizeName(orig) {
            var name = orig.replace(/-/g, '');
            name = name.replace(/\./g, '_');
            logger.trace('Graph | normalizeName: normalizing name: ' + orig + '->' + name);
            return name;
        }
    }, {
        key: 'complete',
        value: function complete() {
            this.completeDependencyDeclaration();

            return {
                pathToPackageJson: this._pathToPackageJson,
                dependencyDeclarations: this.dependencyDeclarations
            };
        }
    }]);

    return RegistryDSL;
})();