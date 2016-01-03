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

    describe('#declaration', function() {
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
    describe('#instantiations', function() {
        //    context('when calling ', function() {
        //        it('should return array of instantiation objects', function() {
        //            var result = mut(
        //                    x=>x.pathToRoot(path.resolve('./'))
        //                        .for('logger').require('tests/TestModules/loggerMock')
        //                        .complete(),
        //                    x=>x.instantiate('logger').asClass().complete());
        //
        //            demand(result.instantiations).must.not.be.undefined();
        //            console.log(result.instantiations);
        //            result.instantiations[0].name.must.equal('logger');
        //            result.instantiations[0].dependencyType.must.equal('class');
        //        });
        //    });

        context('when calling with bad dep name', function() {
            it('should return array of instantiation objects', function() {
                var err;
                try {
                    mut(
                            x=>x.pathToRoot(path.resolve('./'))
                            .for('logger').require('tests/TestModules/loggerMock')
                            .complete(),
                            x=>x.instantiate('flogger').asClass().complete());
                }catch(ex){
                    err = ex.message;
                }
                err.must.contain('There is no dependency name flogger declared to instantiate')
            });
        });

    });
});