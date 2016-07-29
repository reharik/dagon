/**
 * Created by rharik on 12/21/15.
 */
var demand = require('must');
var path = require('path');

describe('REQUIRE DEPENDENCY OF THROW TESTER', function() {
    var mut;

    before(function() {
        mut        = require('../../src/graphResolution/requireDependencyOrThrow');
    });

    describe('#REQUIREDEPENDENCYOFTHROW', function() {

        context('when calling requireDependencyOrThrow with a name that can be resolved', function () {
            it('should resolve dependency', function () {
                var resDeps = [];
                mut(resDeps, 'JSON');
                demand(resDeps[0]).not.be.undefined();
                resDeps[0].name.must.equal('JSON');
                resDeps[0].resolvedInstance.must.be.object();
            })
        });

        context('when calling requireDependencyOrThrow with a name that can NOT be resolved', function () {
            it('should throw proper error', function () {
                var error = '';
                try {
                    var resDeps = [];
                    mut(resDeps, 'fiddlesticks');
                }catch(ex){
                    error = ex.message;
                }
                error.must.contain('item was not found and require threw an error: fiddlesticks');
            })
        });
    });
});
