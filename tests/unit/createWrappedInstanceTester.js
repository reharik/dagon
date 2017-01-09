/**
 * Created by reharik on 12/7/15.
 */
var demand = require('must');

describe('container builder Test', function() {
    var mut;

    before(function(){
        mut = require('../../src/containerModules/createWrappedInstances');
    });

    describe('#INTERNAL', function() {
        context('when calling ', function() {
            it('should put proper wrapped function', function() {

                var dep = { name: 'logger',
                    path: '../../tests/TestModules/loggerMock',
                    internal: true};
                var result = mut([dep]);
                var instance = require(dep.path).toString();
                demand(result.dependencies[0].wrappedInstance).must.not.be.undefined();
                result.dependencies[0].wrappedInstance.toString().must.eql(instance);
            });
        });
    });

    describe('#SUB', function() {
        context('when calling ', function() {
            it('should put proper wrapped function', function() {

                var dep = { name: 'logger',
                    subWith: () => 'in line substitution',
                    substitution: true};
                var result = mut([dep]);
                result.dependencies[0].wrappedInstance().toString().must.contain('in line substitution');
            });
        });
    });

    describe('#EXTERNAL', function() {
        context('when calling external dep', function() {
            it('should put proper wrapped function', function() {
                var dep = { name: 'JSON',
                    path: 'JSON'};
                var result = mut([dep]);
                demand(result.dependencies[0].wrappedInstance).must.not.be.undefined();
                result.dependencies[0].wrappedInstance.toString().must.contain('return require(path)');
            });
        });
    });
});

