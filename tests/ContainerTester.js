/**
 * Created by rharik on 7/1/15.
 */

var demand = require('must');
var path = require('path');
describe('Container Test', function() {
    var Mut;

    before(function(){
        Mut = require('../src/Container');
    });

    describe('#instantiate Container', function() {
        context('when instantiating Container without reg func', function () {
            it('should throw proper error', function () {
                (function(){new Mut()}).must.throw(Error,'Invariant Violation: Container requires at least one registry function');
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
                    .forDependencyParam('testWithArrayDependency').requireThisInternalModule('/tests/testWithArrayDependency')
                    .complete());
                //console.log(mut.getInstanceOf('testWithArrayDependency')());
                mut.getInstanceOf('testWithArrayDependency')().deps.must.be.array();
            })
        });

        context('when instantiating contaienr', ()=>{
            it('should apply registry to graph',()=>{
                var mut = new Mut(x=>
                    x.pathToRoot(path.resolve('./'))
                        .forDependencyParam('logger').requireThisInternalModule('/tests/TestModules/loggerMock')
                        .complete());
                var logger = mut.dependencyGraph._items.find(x=>x.name == 'logger');
                logger.path.must.equal('/tests/TestModules/loggerMock');
            })
        });

        context('when instantiating contaienr', ()=>{
            it('should resolve graph',()=>{
                var mut = new Mut(x=>
                    x.pathToRoot(path.resolve('./'))
                        .forDependencyParam('TestClass').requireThisInternalModule('/tests/TestModules/TestClass')
                        .forDependencyParam('TestClassBase').requireThisInternalModule('/tests/TestModules/TestClassBase')
                        .forDependencyParam('pointlessDependency').requireThisInternalModule('/tests/TestModules/pointlessDependency')
                        .complete());
                console.log(mut.dependencyGraph);
                mut.dependencyGraph._items.forEach(x=> x.resolvedInstance.must.not.null());
                var TestClass = mut.dependencyGraph._items.find(x=>x.name=='TestClass').resolvedInstance;
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
                        .complete());
                mut.getInstanceOf('logger').must.be.object();
            })
        });

        context('when calling getInstanceOf with item that DOES NOT exists', function () {
            it('should return null and not throw', function () {
                var mut = new Mut(x=>
                    x.pathToRoot(path.resolve('./'))
                        .complete());
                demand(mut.getInstanceOf('piglogger')).be.undefined();
                (function(){mut.getInstanceOf('piglogger')}).must.not.throw(Error);
            })
        });
    });


    describe('#whatDoIHave', function() {
        context('when calling whatDoIHave', function () {
            it('should return bunch of stuff', function () {
                var mut = new Mut(x=>
                    x.pathToRoot(path.resolve('./'))
                        .forDependencyParam('TestClass').requireThisInternalModule('/tests/TestModules/TestClass')
                        .forDependencyParam('TestClassBase').requireThisInternalModule('/tests/TestModules/TestClassBase')
                        .forDependencyParam('pointlessDependency').requireThisInternalModule('/tests/TestModules/pointlessDependency')
                        .complete());
                console.log(mut.whatDoIHave());
                mut.whatDoIHave().must.not.be.empty();
            })
        });

        //TODO write tests for options you lazy fuck
    });

    describe('#inject', function() {
        context('when calling inject', function () {
            it('should rebuild container with new dependency', function () {
                var mut = new Mut(x=>
                    x.pathToRoot(path.resolve('./'))
                        .complete());
                mut.inject({name:'logger', path:'/tests/TestModules/loggerMock', internal:true});
                var TestClass = mut.getInstanceOf('TestClass');
                new TestClass().callLogger('worked').must.equal('worked');
            })
        });
    });

});