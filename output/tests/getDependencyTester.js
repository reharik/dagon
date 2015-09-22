/**
 * Created by parallels on 9/10/15.
 */

var demand = require('must');
var path = require('path');
var moment = require('moment');

describe('getDependency Test', function() {
    var Mut;

    before(function() {
        Mut        = require('../src/getDependency');
        var logger = require('../src/logger');
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

    describe('#fullDependency', function() {
        context('when calling fullDependency should throw proper error if no graph provided', function () {
            it('should throw proper error', function () {
                (function(){Mut.fullDependency()}).must.throw(Error,'Invariant Violation: You must provide a a collection of dependencies to query');
            })
        });

        context('when calling fullDependency should throw proper error if no dependencyName is provided', function () {
            it('should throw proper error', function () {
                (function(){Mut.fullDependency([])}).must.throw(Error,'Invariant Violation: You must provide a dependency name to find');
            })
        });

        context('when calling fullDependency with dependencyName that is not in graph', function () {
            it('should return null', function () {
                demand(Mut.fullDependency([],'testDependency')).be.undefined()
            })
        });

        context('when calling fullDependency with dependencyName that IS in graph', function () {
            it('should return proper dependency', function () {
                Mut.fullDependency([{name: 'testDependency'}],'testDependency').name.must.be('testDependency');
            })
        });

        context('when calling fullDependency with dependencyName that IS in graph', function () {
            it('should return dependency with all metadata', function () {
                Mut.fullDependency([{name: 'testDependency', internal:true}],'testDependency').internal.must.be.true();
            })
        });

        context('when calling fullDependency with dependencyName that is a groupName', function () {
            it('should return return proper array of items', function () {
                var groupItem1 = {name: 'testDependency1', groupName:'group!'};
                var groupItem2 = {name: 'testDependency2', groupName:'group!'};
                var groupItem3 = {name: 'testDependency3', groupName:'group!'};
                var result = Mut.fullDependency([groupItem1, groupItem2, groupItem3], 'group!');
                result.must.be.an.array();
                result.must.have.length(3);
                result[2].name.must.be('testDependency3');
            })
        });

        context('when calling fullDependency with dependencyName that is a groupName', function () {
            it('should return return array of items with all metadata', function () {
                var groupItem1 = {name: 'testDependency1', groupName:'group!'};
                var groupItem2 = {name: 'testDependency2', groupName:'group!'};
                var groupItem3 = {name: 'testDependency3', groupName:'group!', internal:true};
                var result = Mut.fullDependency([groupItem1, groupItem2, groupItem3], 'group!');
                result.must.be.an.array();
                result.must.have.length(3);
                result[2].internal.must.be.true();
            })
        });
        context('when calling fullDependency with dependencyName that is not in graph, and not a group, but is rquireable', function () {
            it('should return proper dependency', function () {
                Mut.fullDependency([],'extend').must.not.be.undefined();
            })
        });

        context('when calling fullDependency with dependencyName that is not in graph, and not a group, but is rquireable', function () {
            it('should return proper dependency with proper metadata', function () {
                Mut.fullDependency([],'extend').resolvedInstance.must.not.be.undefined();
            })
        });

    });

    describe('#resolvedInstance', function() {
        context('when calling resolvedInstance should throw proper error if no graph provided', function () {
            it('should throw proper error', function () {
                (function(){Mut.resolvedInstance()}).must.throw(Error,'Invariant Violation: You must provide a a collection of dependencies to query');
            })
        });

        context('when calling resolvedInstance should throw proper error if no dependencyName is provided', function () {
            it('should throw proper error', function () {
                (function(){Mut.resolvedInstance([])}).must.throw(Error,'Invariant Violation: You must provide a dependency name to find');
            })
        });

        context('when calling resolvedInstance with dependencyName that is not in graph', function () {
            it('should return null', function () {
                demand(Mut.resolvedInstance([],'testDependency')).be.undefined();
            })
        });

        context('when calling resolvedInstance with dependencyName that IS in graph', function () {
            it('should return proper dependency', function () {
                var result = Mut.resolvedInstance([{name: 'testDependency', internal:true, resolvedInstance:function(){'no-op'}}],'testDependency');
                demand(result.internal).be.undefined();
                result.must.be.function();
            })
        });

        context('when calling resolvedInstance with dependencyName that is a groupName', function () {
            it('should return return proper array of items', function () {
                var groupItem1 = {name: 'testDependency1', groupName:'group!', internal:true, resolvedInstance:function(){'no-op'}};
                var groupItem2 = {name: 'testDependency2', groupName:'group!', internal:true, resolvedInstance:function(){'no-op'}};
                var groupItem3 = {name: 'testDependency3', groupName:'group!', internal:true, resolvedInstance:function(){'no-op'}};
                var result = Mut.resolvedInstance([groupItem1, groupItem2, groupItem3], 'group!');
                result.must.be.an.array();
                result.must.have.length(3);
                demand(result[2].internal).be.undefined();
                result[2].must.be.function()
            })
        });

        context('when calling resolvedInstance with dependencyName that is not in graph, and not a group, but is rquireable', function () {
            it('should return proper dependency', function () {
                Mut.resolvedInstance([],'extend').must.not.be.undefined();
            })
        });

        context('when calling resolvedInstance with dependencyName that is not in graph, and not a group, but is rquireable', function () {
            it('should return proper dependency with proper metadata', function () {
                demand(Mut.resolvedInstance([],'extend').resolvedInstance).be.undefined();
            })
        });

    });

});
