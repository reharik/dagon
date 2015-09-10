/**
 * Created by rharik on 7/1/15.
 */

var demand = require('must');

describe('Instantiate DSL Tester', function() {
    var Mut;
    var mut;

    before(function(){
        Mut = require('../src/InstantiateDSL');
    });

    beforeEach(function(){
        mut = new Mut()
    });

    describe('#testing DSL', function() {
        context('when calling asClass', function () {
            it('should set current Instance to AsClass', function () {
                mut.asClass();
                mut._currentInstance.dependencyType.must.equal('class');
            })
        });

        context('when calling withParameterts before setting dependencyType', function () {
            it('should throw proper error', function () {
                (function(){mut.withParameters('myParameter')}).must.throw(Error,'Invariant Violation: You must set dependency type before calling withParameters. e.g. asClass, asFunc');
            })
        });

        context('when calling withParameterts with no params', function () {
            it('should throw proper error', function () {
                (function(){mut.asClass().withParameters()}).must.throw(Error,'Invariant Violation: You must provide parameters when calling withParameters');
            })
        });

        context('when calling withParameters that are not in an array', function () {
            it('should put all params in array set current Instance parameters property', function () {
                mut.asClass().withParameters('myParameter1', 'myParameter2');
                mut._currentInstance.parameters.must.eql(['myParameter1', 'myParameter2']);
            })
        });

        context('when calling withParameterts', function () {
            it('should set current Instance parameters property', function () {
                mut.asClass().withParameters(['myParameter']);
                mut._currentInstance.parameters.must.eql(['myParameter']);
            })
        });

        context('when calling initializeWithMethod with no method', function () {
            it('should throw proper error', function () {
                (function(){mut.initializeWithMethod()}).must.throw(Error,'Invariant Violation: You must provide method to call for initilization');
            })
        });

        context('when calling initializeWithMethod', function () {
            it('should set initilizationMethod on current instance', function () {
                mut.initializeWithMethod('someMethod');
                mut._currentInstance.initializationMethod.must.equal('someMethod');
            })
        });

        context('when calling withInitParameters with out setting initilization method', function () {
            it('should throw proper error', function () {
                (function(){mut.withInitParameters()}).must.throw(Error,'Invariant Violation: You must call initializeWithMethod before calling withInitParameters');
            })
        });

        context('when calling withInitParameters with no parameters', function () {
            it('should throw proper error', function () {
                (function(){mut.initializeWithMethod('someMethod')
                    .withInitParameters()}).must.throw(Error,'Invariant Violation: You must provide parameters when calling withInitParameters');
            })
        });

        context('when calling initParameters with parameters that are not an array', function () {
            it('should put them in an array', function () {
                mut.initializeWithMethod('someMethod')
                    .withInitParameters('myParameter1', 'myParameter2');
                mut._currentInstance.initParameters.must.eql(['myParameter1', 'myParameter2']);
            })
        });

        context('when calling with initParameters', function () {
            it('should set current Instance initParameters property', function () {
                mut.initializeWithMethod('someMethod').withInitParameters(['myParameter']);
                mut._currentInstance.initParameters.must.eql(['myParameter']);
            })
        });

        context('when calling get options', function () {
            it('should return currentInstance', function () {
                mut.initializeWithMethod('someMethod').withInitParameters(['myParameter']);
                mut.getOptions().must.eql({initializationMethod:'someMethod', initParameters: ['myParameter']});
            })
        });

    });
});
