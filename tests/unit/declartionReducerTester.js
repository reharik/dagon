/**
 * Created by rharik on 1/3/16.
 */

var demand = require('must');
var path = require('path');
var moment = require('moment');
var R = require('ramda');
var fs = require('fs');

describe('declaration reducer Test', function() {
    var mut;

    before(function(){
        mut = require('../../src/containerModules/declarationReducer');
        var logger = require('../../src/logger');


    });

    describe('#RENAME', function() {
        context('when calling ', function() {
            it('should rename and leave the original', function() {
                var dependentMod1 = fs.realpathSync('tests/TestModules/dependentModule1/dependentMod1.js');
                var result = mut(x=>
                    x.pathToRoot(path.resolve('./'))
                        .for('logger').require('tests/TestModules/loggerMock')
                        .for('logger').renameTo('xxxLogger')
                        .requiredModuleRegistires([dependentMod1])
                        .complete());
                demand(result.find(x=> x.name == 'treis')).must.not.be.undefined();
                demand(result.find(x=> x.name == 'treisxxx')).must.not.be.undefined();
                demand(result.find(x=> x.name == 'xxxLogger')).must.not.be.undefined();
                demand(result.find(x=> x.name == 'logger')).must.not.be.undefined();
            });
        });
    });

    describe('#REPLACE', function() {
        context('when calling ', function() {
            it('should replace the target', function() {
                var dependentMod1 = fs.realpathSync('tests/TestModules/dependentModule1/dependentMod1.js');
                var result = mut(x=>
                    x.pathToRoot(path.resolve('./'))
                        .for('logger').require('tests/TestModules/loggerMock')
                        .for('ramda').replaceWith('logger')
                        .requiredModuleRegistires([dependentMod1])
                        .complete());

                demand(result.find(x=> x.name == 'ramda')).must.not.be.undefined();
                demand(result.find(x=> x.name == 'logger')).must.not.be.undefined();
                result.find(x=> x.name == 'ramda').path.must.contain('tests/TestModules/loggerMock');
            });
        });
    });

    describe('#SUB', function() {
        context('when calling ', function() {
            it('should substitue the target', function() {
                var dependentMod1 = fs.realpathSync('tests/TestModules/dependentModule1/dependentMod1.js');
                var result = mut(x=>
                  x.pathToRoot(path.resolve('./'))
                    .for('ramda').subWith(() => { return "substitued item"})
                    .requiredModuleRegistires([dependentMod1])
                    .complete());

                result.find(x=> x.name == 'ramda').subWith().must.equal("substitued item");
            });
        });
    });

    describe('#UNIQUE', function() {
        context('when calling ', function() {
            it('should reduce to only unique values', function() {
                var dependentMod1 = fs.realpathSync('tests/TestModules/dependentModule1/dependentMod1.js');
                var result = mut(x=>
                    x.pathToRoot(path.resolve('./'))
                        .for('logger').require('/tests/TestModules/loggerMock')
                        .for('logger').renameTo('xxxLogger')
                        .requiredModuleRegistires([dependentMod1])
                        .complete());

                R.uniq(result).length.must.equal(result.length)
            });
        });
    });
    describe('#INSTANTIATIONS', function() {
        context('when calling with bad dep name', function() {
            it('should return proper error', function() {
                var err;
                try {
                    mut(x=>x.pathToRoot(path.resolve('./'))
                            .for('logger').require('tests/TestModules/loggerMock')
                            .complete(),
                            x=>x.instantiate('flogger').asClass().complete());
                } catch (ex) {
                    err = ex.message;
                }
                err.must.contain('There is no dependency name flogger declared to instantiate')
            });
        });

    });
});