/**
 * Created by reharik on 12/7/15.
 */
var demand = require('must');
var path = require('path');
var moment = require('moment');
var R = require('ramda');

describe('container builder Test', function() {
    var mut;

    before(function(){
        mut = require('../src/containerBuilder');
        var logger = require('../src/logger');

    });

    describe('#dependencies', function() {
        context('when calling ', function() {
            it('should rename and leave the original', function() {
                var result = mut(x=>
                    x.pathToRoot(path.resolve('./'))
                        .for('logger').require('/tests/TestModules/loggerMock')
                        .for('logger').renameTo('xxxLogger')
                        .requiredModuleRegistires(['./../tests/TestModules/dependentModule1/dependentMod1.js'])
                        .complete());

                demand(result.dependencies.find(x=> x.name == 'treis')).must.not.be.undefined();
                demand(result.dependencies.find(x=> x.name == 'treisxxx')).must.not.be.undefined();
                demand(result.dependencies.find(x=> x.name == 'xxxLogger')).must.not.be.undefined();
                demand(result.dependencies.find(x=> x.name == 'logger')).must.not.be.undefined();
            });
        });

        context('when calling ', function() {
            it('should reduce to only unique values', function() {
                var result = mut(x=>
                    x.pathToRoot(path.resolve('./'))
                        .for('logger').require('/tests/TestModules/loggerMock')
                        .for('logger').renameTo('xxxLogger')
                        .requiredModuleRegistires(['./../tests/TestModules/dependentModule1/dependentMod1.js'])
                        .complete());

                R.uniq(result.dependencies).length.must.equal(result.dependencies.length)
            });
        });
    });

    describe('#instantiations', function() {
        context('when calling ', function() {
            it('should return array of instantiation objects', function() {
                var result = mut(
                        x=>x.pathToRoot(path.resolve('./'))
                            .for('logger').require('/tests/TestModules/loggerMock')
                            .complete(),
                        x=>x.instantiate('logger').asClass().complete());

                demand(result.instantiations).must.not.be.undefined();
                console.log(result.instantiations);
                result.instantiations[0].name.must.equal('logger');
                result.instantiations[0].dependencyType.must.equal('class');
            });
        });

        context('when calling with bad dep name', function() {
            it('should return array of instantiation objects', function() {
                var err;
                try {
                    mut(
                        x=>x.pathToRoot(path.resolve('./'))
                            .for('logger').require('/tests/TestModules/loggerMock')
                            .complete(),
                        x=>x.instantiate('flogger').asClass().complete());
                }catch(ex){
                    err = ex.message;
                }
                err.must.equal('Invariant Violation: There is no dependency name flogger declared to instantiate')
            });
        });

    });
});

