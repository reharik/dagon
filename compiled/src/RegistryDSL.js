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

module.exports = (function () {
    function RegistryDSL() {
        _classCallCheck(this, RegistryDSL);

        this._pathToPackageJson;
        this.dependencyDeclarations = [];
        this.renamedDeclarations = [];
        this._declarationInProgress;
        this._renameInProgress;
    }

    _createClass(RegistryDSL, [{
        key: 'pathToRoot',
        value: function pathToRoot(_path) {
            appRoot.path = _path;
            var resolvedPath = path.join(appRoot.path, '/package.json');
            invariant(fs.existsSync(resolvedPath), 'Path to package.json does not resolve: ' + path.resolve(resolvedPath));
            this._pathToPackageJson = resolvedPath;
            return this;
        }
    }, {
        key: 'forDependencyParam',
        value: function forDependencyParam(param) {
            invariant(param, 'You must provide a valid dependency parameter');
            this._declarationInProgress = {
                name: param
            };
            return this;
        }
    }, {
        key: 'requireThisModule',
        value: function requireThisModule(path, isInternal) {
            invariant(path, 'You must provide a valid replacement module');
            invariant(this._declarationInProgress, 'You must call "forDependencyParam" before calling "requireThisModule"');
            this._declarationInProgress.path = path;
            this.dependencyDeclarations.push(new Dependency({ name: this._declarationInProgress.name, path: this._declarationInProgress.path, internal: isInternal }));
            this._declarationInProgress = null;
            return this;
        }
    }, {
        key: 'requireThisInternalModule',
        value: function requireThisInternalModule(_path) {
            this.requireThisModule(_path, true);
            return this;
        }
    }, {
        key: 'replace',
        value: function replace(name) {
            invariant(name, 'You must provide the name of the your dependency');
            this._renameInProgress = { oldName: name };
            return this;
        }
    }, {
        key: 'withThis',
        value: function withThis(name) {
            invariant(name, 'You must provide the new name');
            invariant(this._renameInProgress, 'You must call "replace" before calling "withThis"');
            this._renameInProgress.name = name;
            this.renamedDeclarations.push(this._renameInProgress);
            this._renameInProgress = null;
            return this;
        }
    }, {
        key: 'complete',
        value: function complete() {
            invariant(this._pathToPackageJson, 'You must provide a path to your package.json before calling complete');

            return {
                pathToPackageJson: this._pathToPackageJson,
                dependencyDeclarations: this.dependencyDeclarations,
                renamedDeclarations: this.renamedDeclarations
            };
        }
    }]);

    return RegistryDSL;
})();