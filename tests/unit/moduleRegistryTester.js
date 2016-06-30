/**
 * Created by rharik on 7/1/15.
 */
"use strict";

var demand = require('must');
var path = require('path');
var moment = require('moment');
var fs = require('fs');

describe('moduleRegistry Test', function() {
    var mut;

    before(function(){
        mut = require('../../src/containerModules/moduleRegistry');
        var logger = require('../../src/logger');
        //if(!logger.exposeInternals().options.console.formatter){
        //    logger.addConsoleSink({
        //        level    : 'debug',
        //        colorize : true,
        //        formatter: function(x) {
        //            return '[' + x.meta.level + '] module: DAGon msg: ' + x.meta.message + ' | ' + moment().format('h:mm:ss a');
        //        }
        //    }).info("added Console Sink");
        //}
    });

    describe('#instantiate moduleRegistry', function() {
        context('when instantiating moduleRegistry without reg func', function () {
            it('should throw proper error', function () {
                var error = '';
                try {
                    mut()
                }catch(err){
                    error = err;
                }
                error.message.must.contain('Error collecting dependencies.  Check nested exceptions for more details.');
            })
        });

        context('when instantiating moduleRegistry WITH reg func', ()=> {
            it('should NOT throw registry func error', ()=> {
                var error;
                try {
                    mut(x=>x.pathToRoot(path.resolve('./')).complete());
                }catch(err){
                    error = err;
                }
                demand(error).must.be.undefined();
            })
        });

        //context('when instantiating moduleRegistry with object that takes array of deps', ()=> {
        //    it('should map that object properly', ()=> {
        //        var result =  mut(x=>x.pathToRoot(path.resolve('./'))
        //            .groupAllInDirectory('/tests/TestModules','testGroup')
        //            .for('logger').require('./tests/TestModules/loggerMock')
        //            .for('testWithArrayDependency').require('/tests/testWithArrayDependency')
        //            .complete());
        //        result.wrappedDependencies.length.must.be.gt(0);
        //    })
        //});

        context('when instantiating moduleregistry with manual registry', ()=>{
            it('should return item in list',()=>{
                var result = mut(x=>
                    x.pathToRoot(path.resolve('./'))
                        .for('logger').require('/tests/TestModules/loggerMock')
                        .complete());
                var logger = result.overrideDeclarations.find(x=>x.name == 'logger');
                logger.path.must.equal(path.resolve('./tests/TestModules/loggerMock'));
                logger.internal.must.be.true();
            })
        });

        context('when instantiating moduleregistry with overrride', ()=>{
            it('should return item in overrides',()=>{
                var result = mut(x=>
                    x.pathToRoot(path.resolve('./'))
                        .for('logger').renameTo('damnLogger')
                        .complete());
                var logger = result.overrideDeclarations.find(x=>x.name == 'logger');
                demand(logger).must.not.be.undefined();
                logger.newName.must.equal('damnLogger');
            })
        });

        context('when calling moduleReg with dependent dagon modules', function() {
            it('should add their dependencies', function() {
                var dependentMod1 = fs.realpathSync('tests/TestModules/dependentModule1/dependentMod1.js');
                var result = mut(x=>
                    x.pathToRoot(path.resolve('./'))
                        .for('logger').require('./tests/TestModules/loggerMock')
                        .requiredModuleRegistires([dependentMod1])
                        .complete());
                result.dependencyDeclarations.some(x=>x.name == 'treis').must.be.true();
            });
        });

        context('when calling moduleReg with dependent dagon modules', function() {
            it('should add their dependencies', function() {

                var a = [{name:'a', path:'aaa'}, {name:'b', path:'bbb'}];
                var b = [{name:'a', path:'aaa'}, {name:'c', path:'ccc'}];
                var objA = {name:'a', path:'aaa'};
                var objB = {name:'a', path:'aaa'};
                var c = a.concat(b);
                console.log(objA == objB);
                console.log(c);

            });
        });


    });
});
