/**
 * Created by rharik on 6/24/15.
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var invariant = require('invariant');
var logger = require('./yowlWrapper');

module.exports = (function () {
    function InstantiateDSL() {
        _classCallCheck(this, InstantiateDSL);

        this._currentInstance = {};
    }

    _createClass(InstantiateDSL, [{
        key: 'asClass',
        value: function asClass() {
            logger.trace('InstantiateDSL | asClass');
            this._currentInstance.dependencyType = 'class';
            return this;
        }
    }, {
        key: 'asFunc',
        value: function asFunc() {
            logger.trace('InstantiateDSL | asFunc');
            this._currentInstance.dependencyType = 'func';
            return this;
        }
    }, {
        key: 'withParameters',
        value: function withParameters(parameters) {
            var _arguments = arguments;

            invariant(this._currentInstance.dependencyType, 'You must set dependency type before calling withParameters. e.g. asClass, asFunc');
            invariant(arguments[0], 'You must provide parameters when calling withParameters');
            logger.trace('InstantiateDSL | withParameters: putting parameters in array form if not or if object specified');
            if (!Array.isArray(arguments[0])) {
                var _params = [];
                Object.keys(arguments).forEach(function (x) {
                    return _params.push(_arguments[x]);
                });
                this._currentInstance.parameters = _params;
            } else {
                this._currentInstance.parameters = parameters;
            }
            return this;
        }
    }, {
        key: 'initializeWithMethod',
        value: function initializeWithMethod(method) {
            invariant(method, 'You must provide method to call for initilization');
            logger.trace('InstantiateDSL | initializeWithMethod: specifying dependency should be initialized with following method: ' + method);
            this._currentInstance.initializationMethod = method;
            return this;
        }
    }, {
        key: 'withInitParameters',
        value: function withInitParameters(params) {
            var _arguments2 = arguments;

            invariant(this._currentInstance.initializationMethod, 'You must call initializeWithMethod before calling withInitParameters');
            invariant(params, 'You must provide parameters when calling withInitParameters');
            logger.trace('InstantiateDSL | withInitParameters: specifying initialization should be passed parameter');
            logger.trace('InstantiateDSL | withInitParameters: putting parameters in array form if not or if object specified');
            if (!Array.isArray(arguments[0])) {
                var _params = [];
                Object.keys(arguments).forEach(function (x) {
                    return _params.push(_arguments2[x]);
                });
                this._currentInstance.initParameters = _params;
            } else {
                this._currentInstance.initParameters = params;
            }
            return this;
        }
    }, {
        key: 'getOptions',
        value: function getOptions() {
            return this._currentInstance;
        }
    }]);

    return InstantiateDSL;
})();