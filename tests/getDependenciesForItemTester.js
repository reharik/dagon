/**
 * Created by parallels on 9/10/15.
 */

var demand = require('must');
var path = require('path');
var moment = require('moment');

describe('getDependenciesForItem Test', function() {
    var Mut;

    before(function() {
        Mut        = require('../src/getDependenciesForItem');
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

    describe('#flatDependencyGraph', function() {
        context('when calling flatDependencyGraph with no item provided', function () {
            it('should throw proper error', function () {
                (function(){Mut.flatDependencyGraph()}).must.throw(Error,'Invariant Violation: flatDependencyGraph requires an item to get dependencies for.');
            })
        });

        context('when calling flatDependencyGraph with no graph provided', function () {
            it('should throw proper error', function () {
                (function(){Mut.flatDependencyGraph({})}).must.throw(Error,'Invariant Violation: flatDependencyGraph requires a collection of items to query for dependencies.');
            })
        });

        context('when calling flatDependencyGraph with item that has unresolveable dependency', function () {
            it('should throw proper error', function () {
                var item = {
                    name:"testItem",
                    wrappedInstance: function(cantResolve){
                        return function(){ 'whoo hooo'}
                    }
                };
                (function(){Mut.flatDependencyGraph(item,[])}).must.throw(Error,'Invariant Violation: Module ' + item.name + ' has a dependency that can not be resolved: cantResolve');
            })
        });

        context('when calling flatDependencyGraph with item that has RESOLVEABLE dependency', function () {
            it('should return array of dependency metadata items', function () {
                var item = {
                    name:"testItem",
                    wrappedInstance: function(canResolve){
                        return function(){ 'whoo hooo'}
                    }
                };
                var graph = [
                    {name: 'canResolve'}
                ];
                Mut.flatDependencyGraph(item,graph).must.be.an.array();
                Mut.flatDependencyGraph(item,graph)[0].name.must.be('canResolve');
            })
        });

        context('when calling flatDependencyGraph with item that has grouped dependencies', function () {
            it('should return a FLAT array of dependency metadata items', function () {
                var item = {
                    name:"testItem",
                    wrappedInstance: function(canResolve, groupedItems){
                        return function(){ 'whoo hooo'}
                    }
                };
                var graph = [
                    {name: 'canResolve'},
                    {name: 'groupedItem1', groupName:'groupedItems'},
                    {name: 'groupedItem2', groupName:'groupedItems'},
                    {name: 'groupedItem3', groupName:'groupedItems'}

                ];
                Mut.flatDependencyGraph(item,graph).must.be.an.array();
                Mut.flatDependencyGraph(item,graph).must.have.length(4);
            })
        });
    });

    describe('#resolvedItemsGraph', function() {
        context('when calling resolvedItemsGraph with no item provided', function () {
            it('should throw proper error', function () {
                (function(){Mut.resolvedItemsGraph()}).must.throw(Error,'Invariant Violation: resolvedItemsGraph requires an item to get dependencies for.');
            })
        });

        context('when calling resolvedItemsGraph with no graph provided', function () {
            it('should throw proper error', function () {
                (function(){Mut.resolvedItemsGraph({})}).must.throw(Error,'Invariant Violation: resolvedItemsGraph requires a collection of items to query for dependencies.');
            })
        });

        context('when calling resolvedItemsGraph with item that has unresolveable dependency', function () {
            it('should throw proper error', function () {
                var item = {
                    name:"testItem",
                    wrappedInstance: function(cantResolve){
                        return function(){ 'whoo hooo'}
                    }
                };
                (function(){Mut.resolvedItemsGraph(item,[])}).must.throw(Error,'Invariant Violation: Module ' + item.name + ' has a dependency that can not be resolved: cantResolve');
            })
        });

        context('when calling resolvedItemsGraph with item that has RESOLVEABLE dependency', function () {
            it('should return array of resolved instances', function () {
                var item = {
                    name:"testItem",
                    wrappedInstance: function(canResolve){
                        return function(){ 'whoo hooo'}
                    }
                };
                var graph = [
                    {name: 'canResolve', resolvedInstance: function(){'noop'}, internal:true}
                ];
                Mut.resolvedItemsGraph(item,graph).must.be.an.array();
                demand(Mut.resolvedItemsGraph(item,graph)[0].internal).be.undefined();
                Mut.resolvedItemsGraph(item,graph)[0].must.be.function();

            })
        });

        context('when calling resolvedItemsGraph with item that has grouped dependencies', function () {
            it('should return array of resolved instances but NOT flattened out', function () {
                var item = {
                    name:"testItem",
                    wrappedInstance: function(canResolve, groupedItems){
                        return function(){ 'whoo hooo'}
                    }
                };
                var graph = [
                    {name: 'canResolve', resolvedInstance: function(){'noop'}, internal:true},
                    {name: 'groupedItem1', groupName:'groupedItems', resolvedInstance: function(){'noop'}, internal:true},
                    {name: 'groupedItem2', groupName:'groupedItems', resolvedInstance: function(){'noop'}, internal:true},
                    {name: 'groupedItem3', groupName:'groupedItems', resolvedInstance: function(){'noop'}, internal:true}

                ];
                Mut.resolvedItemsGraph(item,graph).must.be.an.array();
                Mut.resolvedItemsGraph(item,graph).must.have.length(2);
                demand(Mut.resolvedItemsGraph(item,graph)[0].internal).be.undefined();
                demand(Mut.resolvedItemsGraph(item,graph)[1][2].internal).be.undefined();
                Mut.resolvedItemsGraph(item,graph)[0].must.be.function();
                Mut.resolvedItemsGraph(item,graph)[1][2].must.be.function();
            })
        });
    });
});
