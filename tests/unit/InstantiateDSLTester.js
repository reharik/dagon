/**
 * Created by rharik on 7/1/15.
 */

var demand = require('must');

describe('Instantiate DSL Tester', function() {
    var Mut;
    var mut;

    before(function(){
        Mut = require('../../src/containerModules/InstantiateDSL');
    });

    beforeEach(function(){
        mut = new Mut([{name:'myClass'}])
    });

    describe('#testing DSL', function() {
        context('when calling instantiate with no name', function () {
            it('should throw proper error', function () {
                var error;
                try {
                    mut.instantiate();
                } catch (ex) {
                    error = ex.message;
                }
                error.must.contain('You must provide a name for the dependency to instantiate');
            })
        });

        context('when calling instantiate with name not in dependencies', function () {
            it('should throw proper error', function () {
                var error;
                try {
                    mut.instantiate('someclass');
                } catch (ex) {
                    error = ex.message;
                }
                error.must.contain('There is no dependency name someclass declared to instantiate');
            })
        });

        context('when calling asClass without calling instantiate', function () {
            it('should throw proper error', function () {
                var error;
                try {
                    mut.asClass();
                } catch (ex) {
                    error = ex.message;
                }
                error.must.contain('You must provide a dependency name before calling asClass');
            })
        });

        context('when calling asClass', function () {
            it('should create proper declaration', function () {
                var result = mut.instantiate('myClass').asClass().complete();
                demand(result).not.be.undefined();
                result.length.must.equal(1);
                result[0].name.must.equal('myClass');
                result[0].dependencyType.must.equal('class');
            })
        });

        context('when calling asFunc', function () {
            it('should create proper declaration', function () {
                var result = mut.instantiate('myClass').asFunc().complete();
                demand(result).not.be.undefined();
                result.length.must.equal(1);
                result[0].name.must.equal('myClass');
                result[0].dependencyType.must.equal('func');
            })
        });

        context('when calling withParameterts before setting dependencyType', function () {
            it('should throw proper error', function () {
                var error;
                try {
                    mut.instantiate('myClass').withParameters('myParameter');
                } catch (ex) {
                    error = ex.message;
                }
                error.must.contain('You must set dependency type before calling withParameters. e.g. asClass, asFunc');
            })
        });

        context('when calling withParameterts with no params', function () {
            it('should throw proper error', function () {
                var error;
                try {
                    mut.instantiate('myClass').asClass().withParameters();
                } catch (ex) {
                    error = ex.message;
                }
                error.must.contain('You must provide parameters when calling withParameters');
            })
        });

        context('when calling withParameters that are not in an array', function () {
            it('should put all params in array set current Instance parameters property', function () {
                var result = mut.instantiate('myClass').asClass().withParameters('myParameter1', 'myParameter2').complete();
                demand(result).not.be.undefined();
                result.length.must.equal(1);
                result[0].parameters.must.eql(['myParameter1', 'myParameter2'])
            })
        });

        context('when calling initializeWithMethod with no method', function () {
            it('should throw proper error', function () {
                var error;
                try {
                    mut.instantiate('myClass').initializeWithMethod();
                } catch (ex) {
                    error = ex.message;
                }
                error.must.contain('You must provide method to call for initilization');
            })
        });

        context('when calling initializeWithMethod', function () {
            it('should set initilizationMethod on current instance', function () {
                var result = mut.instantiate('myClass').asClass().initializeWithMethod('someMethod').complete();
                demand(result).not.be.undefined();
                result.length.must.equal(1);
                result[0].initializationMethod.must.equal('someMethod');
            })
        });

        context('when calling withInitParameters with out setting initilization method', function () {
            it('should throw proper error', function () {
                var error;
                try {
                    mut.instantiate('myClass').withInitParameters();
                } catch (ex) {
                    error = ex.message;
                }
                error.must.contain('You must call initializeWithMethod before calling withInitParameters');
            })
        });

        context('when calling withInitParameters with no parameters', function () {
            it('should throw proper error', function () {
                var error;
                try {
                    mut.instantiate('myClass').initializeWithMethod('someMethod').withInitParameters();
                } catch (ex) {
                    error = ex.message;
                }
                error.must.contain('You must provide parameters when calling withInitParameters');
            })
        });

        context('when calling initParameters with parameters that are not an array', function () {
            it('should put them in an array', function () {
                var result = mut.instantiate('myClass').initializeWithMethod('someMethod')
                    .withInitParameters('myParameter1', 'myParameter2').complete();
                demand(result).not.be.undefined();
                result.length.must.equal(1);
                result[0].initParameters.must.eql(['myParameter1', 'myParameter2']);
            })
        });

        context('when calling with initParameters with array', function () {
            it('should set current Instance initParameters property', function () {
                var result = mut.instantiate('myClass').initializeWithMethod('someMethod')
                    .withInitParameters(['myParameter1']).complete();
                demand(result).not.be.undefined();
                result.length.must.equal(1);
                result[0].initParameters.must.eql(['myParameter1']);
            })
        });
    });
});
