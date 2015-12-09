/**
 * Created by reharik on 12/7/15.
 */
var demand = require('must');
var path = require('path');
var moment = require('moment');

describe('moduleRegistry Test', function() {
    var mut;

    before(function(){
        mut = require('../src/containerBuilder');
        var logger = require('../src/logger');

    });

    describe('#container builder', function() {
        context('when calling ', function() {
            it('should reduce to only unique values', function() {
                var result = mut(x=>
                    x.pathToRoot(path.resolve('./'))
                        .for('logger').require('/tests/TestModules/loggerMock')
                        .requiredModuleRegistires(['./../tests/TestModules/dependentModule1/dependentMod1.js'])
                        .complete());
                //result.dependencyDeclarations.some(x=>x.name == 'treis').must.be.true();
                console.log(result)
            });
        });
    });
});

