/**
 * Created by parallels on 9/10/15.
 */


var demand = require('must');
var path = require('path');
var moment = require('moment');

describe('groupDependencies Test', function() {
    var Mut;

    before(function() {
        Mut        = require('../src/graphResolution/groupDependencies');
        //var logger = require('../src/logger');
        //if(!logger.exposeInternals().options.console.formatter){
        //    logger.addConsoleSink({
        //        level    : 'silly',
        //        colorize : true,
        //        formatter: function(x) {
        //            return '[' + x.meta.level + '] module: DAGon msg: ' + x.meta.message + ' | ' + moment().format('h:mm:ss a');
        //        }
        //    }).info("added Console Sink");
        //}
    });

    describe('#groupDependencies', function() {
        context('when calling groupDependencies with no items provided', function () {
            it('should throw proper error', function () {
                var error = '';
                try{
                    Mut()
                }catch(ex){
                    error = ex.message;
                }
                error.must.equal('Invariant Violation: groupDependencies requires graph of items to query.');
            })
        });

        context('when calling groupDependencies with no groupname provided', function () {
            it('should throw proper error', function () {
                var error = '';
                try{
                    Mut([])
                }catch(ex){
                    error = ex.message;
                }
                error.must.equal('Invariant Violation: groupDependencies requires an group name to try and build.');
            })
        });
    });

    describe('#groupDependencies as array', function() {
        context('when calling groupDependencies with no grouped items', function () {
            it('should return undefined', function () {
                demand(Mut([],'emptyGroup')).be.undefined();
            })
        });

        context('when calling groupDependencies WITH grouped items', function () {
            it('should return array of items with the target groupname', function () {
                var graph = [
                    {name:'nongroupedItem'},
                    {name:'groupedItem1', groupName:'group!'},
                    {name:'groupedItem2', groupName:'group!'},
                    {name:'groupedItem3', groupName:'group!'}
                ];
                Mut(graph,'group!').must.be.an.array();
                Mut(graph,'group!').must.have.length(3);
            })
        });

        context('when calling groupDependencies WITH grouped items', function () {
            it('should return array of items WITHOUT non group members', function () {
                var graph = [
                    {name:'nongroupedItem'},
                    {name:'groupedItem1', groupName:'group!'},
                    {name:'groupedItem2', groupName:'group!'},
                    {name:'groupedItem3', groupName:'group!'}
                ];
                Mut(graph,'group!').must.not.include({name:'nongroupedItem'});
            })
        });

        context('when calling groupDependencies with underscore array', function () {
            it('should remove underscore array', function () {
                var graph = [
                    {name:'nongroupedItem'},
                    {name:'groupedItem1', groupName:'group!'},
                    {name:'groupedItem2', groupName:'group!'},
                    {name:'groupedItem3', groupName:'group!'}
                ];
                Mut(graph,'group!_array').must.have.length(3);
            })
        });

    });


    describe('#groupDependencies as hash', function() {
        context('when calling groupDependencies with no grouped items', function () {
            it('should return undefined', function () {
                demand(Mut([],'emptyGroup')).be.undefined();
            })
        });

        context('when calling groupDependencies WITHOUT underscore hash', function () {
            it('should remove not return hash', function () {
                var graph = [
                    {name:'nongroupedItem'},
                    {name:'groupedItem1', groupName:'group!'},
                    {name:'groupedItem2', groupName:'group!'},
                    {name:'groupedItem3', groupName:'group!'}
                ];
                Mut(graph,'group!').must.be.an.array();
            })
        });

        context('when calling groupDependencies WITH underscore hash', function () {
            it('should remove return hash', function () {
                var graph = [
                    {name:'nongroupedItem'},
                    {name:'groupedItem1', groupName:'group!'},
                    {name:'groupedItem2', groupName:'group!'},
                    {name:'groupedItem3', groupName:'group!'}
                ];
                Mut(graph,'group!_hash').must.be.an.object();
            })
        });

        context('when calling groupDependencies with underscore hash', function () {
            it('should return hash with property for each item', function () {
                var graph = [
                    {name:'nongroupedItem'},
                    {name:'groupedItem1', groupName:'group!'},
                    {name:'groupedItem2', groupName:'group!'},
                    {name:'groupedItem3', groupName:'group!'}
                ];
                var result = Mut(graph, 'group!_hash');
                result.must.have.property('groupedItem1');
                result.must.have.property('groupedItem2');
                result.must.have.property('groupedItem3');
            })
        });

        context('when calling groupDependencies WITH grouped items', function () {
            it('should return array of items WITHOUT non group members', function () {
                var graph = [
                    {name:'nongroupedItem'},
                    {name:'groupedItem1', groupName:'group!'},
                    {name:'groupedItem2', groupName:'group!'},
                    {name:'groupedItem3', groupName:'group!'}
                ];
                Mut(graph,'group!_hash').must.not.have.property('nongroupedItem');
            })
        });



    });
});
