/**
 * Created by rharik on 12/21/15.
 */
var demand = require('must');
var path = require('path');

describe('GROUP DEPENDENCIES TESTER', function() {
    var mut;

    before(function() {
        mut        = require('../../src/graphResolution/groupDependencies');
    });

    describe('#GROUPDEPENDENCIES', function() {




// these tests are all wrong look what result is! it's just reading from the array just collected
// that's not true. this is just a good example of why you should not modify a parameter. what a bunch of crap



        context('when calling groupdependencies with a name that has _array', function () {
            it('should add item that has an array for the resolved instance', function () {
                var resDeps = [
                    {name:'groupedItem1', groupName:'group!_array', resolvedInstance: {id:'one'}},
                    {name:'groupedItem2', groupName:'group!_array', resolvedInstance: {id:'two'}},
                    {name:'groupedItem3', groupName:'group!_array', resolvedInstance: {id:'three'}}
                ];
                mut(resDeps, 'group!_array');
                var result = resDeps.find(x=>x.name === 'group!_array');
                demand(result).not.be.undefined();
                result.type.must.equal('array');
                result.resolvedInstance.must.be.an.array();
                result.resolvedInstance[0].id.must.equal('one');
            })
        });

        context('when calling groupdependencies with a name that has _hash', function () {
            it('should add item that has an object for the resolved instance', function () {
                var resDeps = [
                    {name:'groupedItem1', groupName:'group!_hash', resolvedInstance: {id:'one'}},
                    {name:'groupedItem2', groupName:'group!_hash', resolvedInstance: {id:'two'}},
                    {name:'groupedItem3', groupName:'group!_hash', resolvedInstance: {id:'three'}}
                ];
                mut(resDeps, 'group!_hash');
                var result = resDeps.find(x=>x.name === 'group!_hash');
                demand(result).not.be.undefined();
                result.type.must.equal('hash');
                result.resolvedInstance.must.be.an.object();
                result.resolvedInstance.groupedItem2.id.must.equal('two');
            })
        });

        context('when calling groupdependencies with a name that has no suffix', function () {
            it('should add item that has an object for the resolved instance', function () {
                var resDeps = [
                    {name:'groupedItem1', groupName:'group!', resolvedInstance: {id:'one'}},
                    {name:'groupedItem2', groupName:'group!', resolvedInstance: {id:'two'}},
                    {name:'groupedItem3', groupName:'group!', resolvedInstance: {id:'three'}}
                ];
                mut(resDeps, 'group!');
                var result = resDeps.find(x=>x.name === 'group!');
                demand(result).not.be.undefined();
                result.type.must.equal('hash');
                result.resolvedInstance.must.be.an.object();
                result.resolvedInstance.groupedItem2.id.must.equal('two');
            })
        });
    });
});
