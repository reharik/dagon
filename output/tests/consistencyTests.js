/**
 * Created by reharik on 7/4/15.
 */

var demand = require('must');

describe('Container Test', function() {

    before(function(){
    });

    describe('#getInstance', function() {
        context('when requiring two different times ', function () {
            it('should return same instance', function () {
                var mut = require('../testBootstrap');
                var testObject1 = mut.getInstanceOf('testObject');
                var secondProp = testObject1.secondPropShouldbeUnique;
                console.log(secondProp);
                var mut2 = require('../testBootstrap');
                var testObject2 = mut2.getInstanceOf('testObject');
                var secondProp2 = testObject2.secondPropShouldbeUnique;
                console.log(secondProp2);
                secondProp2.must.equal(secondProp);
            })
        });
    });
});
