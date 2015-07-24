/**
 * Created by rharik on 6/24/15.
 */

var invariant = require('invariant');

module.exports = class InstantiateDSL {
    constructor() {
        this._currentInstance = {};
    }

    asClass() {
        this._currentInstance.dependencyType = 'class';
        return this;
    }

    asFunc() {
        this._currentInstance.dependencyType = 'func';
        return this;
    }

    withParameters(parameters) {
        invariant(this._currentInstance.dependencyType,
            'You must set dependency type before calling withParameters. e.g. asClass, asFunc');
        invariant(arguments[0], 'You must provide parameters when calling withParameters');
        if (!Array.isArray(arguments[0])) {
            var _params = [];
            Object.keys(arguments).forEach(x=> _params.push(arguments[x]));
            this._currentInstance.parameters = _params;
        } else {
            this._currentInstance.parameters = parameters;
        }
        return this;
    }

    initializeWithMethod(method) {
        invariant(method,
            'You must provide method to call for initilization');
        this._currentInstance.initializationMethod = method;
        return this;
    }

    withInitParameters(params) {
        invariant(this._currentInstance.initializationMethod,
            'You must call initializeWithMethod before calling withInitParameters');
        invariant(params,
            'You must provide parameters when calling withInitParameters');
        if (!Array.isArray(arguments[0])) {
            var _params = [];
            Object.keys(arguments).forEach(x=> _params.push(arguments[x]));
            this._currentInstance.initParameters = _params;
        } else {
            this._currentInstance.initParameters = params;
        }
        return this;
    }

    getOptions() {
        return this._currentInstance;
    }
};

