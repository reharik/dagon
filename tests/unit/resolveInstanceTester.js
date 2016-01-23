/**
 * Created by rharik on 12/20/15.
 */

var demand = require('must');
var path = require('path');

describe('RESOLVE INSTANCE', function() {
    var mut;

    before(function() {
        mut        = require('../../src/graphResolution/resolveInstance');
    });

    describe('#RESOLVEINSTANCE', function() {
        context('when calling resolveInstance on item that is already resolved', function () {
            it('should not try to re resolve instance', function () {
                var item ={
                    name: 'item1'
                };
                var resolvedItems = [item];
                mut([],resolvedItems, item);
                resolvedItems.length.must.be(1);
            })
        });

        context('when calling resolveInstance on item that has no dependencies', function () {
            it('should resolve instance', function () {
                var item ={
                    name: 'item1',
                    wrappedInstance: function(){return function(){return '';}}
                };

                mut([],[], item);
                item.resolvedInstance.must.be.function();
            })
        });

        context('when calling resolveInstance on item that has some a previously resolved dependency', function () {
            it('should resolve instance', function () {
                var item ={
                    name: 'item1',
                    wrappedInstance: function(item2){return function(){return '';}}
                };

                var item2 = {
                    name: 'item2',
                    wrappedInstance: function(){return function(){return '';}}
                };

                var unResolvedDeps = [item2];
                var resolvedDeps = [];
                mut(unResolvedDeps, resolvedDeps, item);
                item.resolvedInstance.must.be.function();
                resolvedDeps.length.must.be(2);
            })
        });

        context('when calling resolveInstance on item that has a grouped Dependency', function () {
            it('should resolve instance', function () {
                var item ={
                    name: 'item1',
                    wrappedInstance: function(groupName){
                        return function(){return groupName;}
                    }
                };

                var groupedItem1 = {
                    name: 'groupedItem1',
                    groupName: 'groupName',
                    wrappedInstance: function(){return function(){return '';}}
                };

                var groupedItem2 = {
                    name: 'groupedItem2',
                    groupName: 'groupName',
                    wrappedInstance: function(){return function(){return '';}}
                };

                var unResolvedDeps = [groupedItem1,groupedItem2];
                var resolvedDeps = [];

                mut(unResolvedDeps,resolvedDeps, item);
                item.resolvedInstance.must.be.function();
                resolvedDeps.length.must.be(4);
                var result = item.resolvedInstance();
                result.groupedItem2.must.be.function();
            })
        });

        context('when calling resolveInstance on item that has a grouped Dependency as array', function () {
            it('should resolve instance', function () {
                var item ={
                    name: 'item1',
                    wrappedInstance: function(groupName_array){
                        return function(){return groupName_array;}
                    }
                };

                var groupedItem1 = {
                    name: 'groupedItem1',
                    groupName: 'groupName_array',
                    wrappedInstance: function(){return function(){return '';}}
                };

                var groupedItem2 = {
                    name: 'groupedItem2',
                    groupName: 'groupName_array',
                    wrappedInstance: function(){return function(){return '';}}
                };

                var unResolvedDeps = [groupedItem1,groupedItem2];
                var resolvedDeps = [];

                mut(unResolvedDeps,resolvedDeps, item);
                item.resolvedInstance.must.be.function();
                resolvedDeps.length.must.be(4);
                var result = item.resolvedInstance();
                result.must.be.array();
                result[1].must.be.function();
            })
        });
        context('when calling resolveInstance on item that has a grouped Dependency where all items are already resolved', function () {
            it('should resolve instance', function () {
                var item ={
                    name: 'item1',
                    wrappedInstance: function(groupName){
                        return function(){return groupName;}
                    }
                };

                var groupedItem1 = {
                    name: 'groupedItem1',
                    groupName: 'groupName',
                    wrappedInstance: function(){return function(){return '';}},
                    resolvedInstance:function(){return '';}
                };

                var groupedItem2 = {
                    name: 'groupedItem2',
                    groupName: 'groupName',
                    wrappedInstance: function(){return function(){return '';}},
                    resolvedInstance:function(){return '';}
                };

                var resolvedDeps = [groupedItem1,groupedItem2];
                var unResolvedDeps = [];

                mut(unResolvedDeps,resolvedDeps, item);
                item.resolvedInstance.must.be.function();
                resolvedDeps.length.must.be(4);
                var result = item.resolvedInstance();
                result.groupedItem2.must.be.function();
            })
        });

        context('when calling resolveInstance on item that has a grouped Dependency where SOME items are already resolved', function () {
            it('should resolve instance', function () {
                var item ={
                    name: 'item1',
                    wrappedInstance: function(groupName){
                        return function(){return groupName;}
                    }
                };

                var groupedItem1 = {
                    name: 'groupedItem1',
                    groupName: 'groupName',
                    wrappedInstance: function(){return function(){return '';}},
                };

                var groupedItem2 = {
                    name: 'groupedItem2',
                    groupName: 'groupName',
                    wrappedInstance: function(){return function(){return '';}},
                    resolvedInstance:function(){return '';}
                };

                var groupedItem3 = {
                    name: 'groupedItem3',
                    groupName: 'groupName',
                    wrappedInstance: function(){return function(){return '';}},
                    resolvedInstance:function(){return '';}
                };

                var resolvedDeps = [groupedItem2,groupedItem3];
                var unResolvedDeps = [groupedItem1];

                mut(unResolvedDeps,resolvedDeps, item);
                item.resolvedInstance.must.be.function();
                resolvedDeps.length.must.be(5);
                var result = item.resolvedInstance();
                result.groupedItem1.must.be.function();
            })
        });
    });
});
