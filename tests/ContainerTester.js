/**
 * Created by rharik on 7/1/15.
 */

var demand = require('must');
var path = require('path');
var moment = require('moment');

describe('Container Test', function() {
    var Mut;

    before(function(){
        Mut = require('../src/Container');
        var logger = require('../src/logger');
        logger.addConsoleSink({
            level:'silly',
            colorize : true,
            formatter: function(x) {
                return '[' + x.meta.level + '] module: DAGon msg: ' + x.meta.message + ' | ' + moment().format('h:mm:ss a');
            }
        }).info("added Console Sink");
    });

    describe('#instantiate Container', function() {
        context('when instantiating Container without reg func', function () {
            it('should throw proper error', function () {
                (function(){new Mut()}).must.throw(Error,'Invariant Violation: You must supply a registry function');
            })
        });

        context('when instantiating Container WITH reg func', ()=> {
            it('should NOT throw registry func error', ()=> {
                (function(){new Mut(x=>x.pathToRoot(path.resolve('./')).complete())}).must.not.throw(Error,'Invariant Violation: Container requires a registry function');
            })
        });

        context('when instantiating Container', ()=> {
            it('should put new grpah on dependencyGraph property', ()=> {
                var mut = new Mut(x=>x.pathToRoot(path.resolve('./')).complete());
                demand(mut.dependencyGraph);
            })
        });

        context('when instantiating Container with object that takes array of deps', ()=> {
            it('should map that object properly', ()=> {
                var mut = new Mut(x=>x.pathToRoot(path.resolve('./'))
                    .groupAllInDirectory('/tests/TestModules','testGroup')
                    .for('logger').require('./tests/TestModules/loggerMock')
                    .for('testWithArrayDependency').require('/tests/testWithArrayDependency')
                    .complete());
                var result = mut.getInstanceOf('testWithArrayDependency')();
                result.deps.length.must.be.gt(0);
            })
        });

        context('when instantiating contaienr', ()=>{
            it('should apply registry to graph',()=>{
                var mut = new Mut(x=>
                    x.pathToRoot(path.resolve('./'))
                        .for('logger').require('/tests/TestModules/loggerMock')
                        .complete());
                var logger = mut.dependencyGraph.find(x=>x.name == 'logger');
                logger.path.must.equal('/tests/TestModules/loggerMock');
            })
        });

        context('when instantiating contaienr', ()=>{
            it('should resolve graph',()=>{
                var mut = new Mut(x=>
                    x.pathToRoot(path.resolve('./'))
                        .for('logger').require('/tests/TestModules/loggerMock')
                        .for('TestClass').require('/tests/TestModules/TestClass')
                        .for('TestClassBase').require('/tests/TestModules/TestClassBase')
                        .for('pointlessDependency').require('/tests/TestModules/pointlessDependency')
                        .complete());
                mut.dependencyGraph.forEach(x=> x.resolvedInstance.must.not.null());
                var TestClass = mut.dependencyGraph.find(x=>x.name=='TestClass').resolvedInstance;
                var testClass = new TestClass('fu');

                testClass.getSomeOtherPropVal().must.equal('fu'+testClass.pointlessDependencyId);
            });
        });
    });

    describe('#getInstanceOf', function() {
        context('when calling getInstanceOf with item that exists', function () {
            it('should return resolved instance', function () {
                var mut = new Mut(x=>
                    x.pathToRoot(path.resolve('./'))
                        .for('logger').require('/tests/TestModules/loggerMock')
                        .complete());
                mut.getInstanceOf('logger').must.be.object();
            })
        });

        context('when calling getInstanceOf with item that DOES NOT exists', function () {
            it('should return null and not throw', function () {
                var mut = new Mut(x=>
                    x.pathToRoot(path.resolve('./'))
                        .complete());
                demand(mut.getInstanceOf('piglogger')).be.null();
                (function(){mut.getInstanceOf('piglogger')}).must.not.throw(Error);
            })
        });
    });


    describe('#whatDoIHave', function() {
        context('when calling whatDoIHave', function () {
            it('should return bunch of stuff', function () {
                var mut = new Mut(x=>
                    x.pathToRoot(path.resolve('./'))
                        .for('logger').require('/tests/TestModules/loggerMock')
                        .for('TestClass').require('/tests/TestModules/TestClass')
                        .for('TestClassBase').require('/tests/TestModules/TestClassBase')
                        .for('pointlessDependency').require('/tests/TestModules/pointlessDependency')
                        .complete());
                console.log(mut.whatDoIHave());
                mut.whatDoIHave().must.not.be.empty();
            })
        });

        //TODO write tests for options you lazy fuck
    });

    //describe('#inject', function() {
    //    context('when calling inject', function () {
    //        it('should rebuild container with new dependency', function () {
    //            var mut = new Mut(x=>
    //                x.pathToRoot(path.resolve('./'))
    //                    .complete());
    //            mut.inject({name:'logger', path:'/tests/TestModules/loggerMock', internal:true});
    //            var TestClass = mut.getInstanceOf('TestClass');
    //            new TestClass().callLogger('worked').must.equal('worked');
    //        })
    //    });
    //});

});
