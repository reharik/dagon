/**
 * Created by rharik on 7/1/15.
 */

var demand = require('must');
var path = require('path');
var moment = require('moment');

describe('Container Test', function() {
    var Mut;

    before(function(){
        Mut = require('../../src/containerModules/container');
    });

    describe('#instantiate Container', function() {
        context('when instantiating Container without reg func', function () {
            it('should throw proper error', function () {
                var error = '';
                try {
                    new Mut()
                }catch(err){
                    error = err;
                }
                error.message.must.contain('You must supply a registry function');
            })
        });

        context('when instantiating Container WITH reg func', ()=> {
            it('should NOT throw registry func error', ()=> {
                var error;
                try {
                    new Mut(x=>x.pathToRoot(path.resolve('./')).complete());
                }catch(err){
                    error = err
                }
                demand(error).must.be.undefined();
            })
        });

        context('when instantiating Container', ()=> {
            it('should put new grpah on dependencyGraph property', ()=> {
                var mut = Mut(x=>x.pathToRoot(path.resolve('./')).complete());
                demand(mut.dependencyGraph);
            })
        });

        context('when instantiating contaienr', ()=>{
            it('should apply registry to graph',()=>{
                var mut = new Mut(x=>
                    x.pathToRoot(path.resolve('./'))
                        .for('logger').require('/tests/TestModules/loggerMock')
                        .complete());
                var logger = mut.getInstanceOf('logger');
                demand(logger.debug).not.be.undefined();
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
                var TestClass = mut.getInstanceOf('TestClass');
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
