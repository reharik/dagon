/**
 * Created by rharik on 7/1/15.
 */
"use strict";

var demand = require('must');
var path = require('path');
var moment = require('moment');

describe('moduleRegistry Test', function() {
    var mut;

    before(function(){
        mut = require('../src/moduleRegistry');
        var logger = require('../src/logger');
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
                error.must.contain('Error building dependency graph.  Check nested exceptions for more details.');
            })
        });

        context('when instantiating moduleRegistry WITH reg func', ()=> {
            it('should NOT throw registry func error', ()=> {
                var error = '';
                try {
                    mut(x=>x.pathToRoot(path.resolve('./')).complete());
                }catch(err){
                    error = err.detailView
                }
                error.must.not.contain('Error building dependency graph.  Check nested exceptions for more details.');
            })
        });

        context('when instantiating moduleRegistry', ()=> {
            it('should put new grpah on dependencyGraph property', ()=> {

                var result = mut(x=>x.pathToRoot(path.resolve('./')).complete());
                demand(result.dependencyGraph);
            })
        });
    
        context('when instantiating moduleRegistry with object that takes array of deps', ()=> {
            it('should map that object properly', ()=> {
                var result =  mut(x=>x.pathToRoot(path.resolve('./'))
                    .groupAllInDirectory('/tests/TestModules','testGroup')
                    .for('logger').require('./tests/TestModules/loggerMock')
                    .for('testWithArrayDependency').require('/tests/testWithArrayDependency')
                    .complete());
                result.dependencies.length.must.be.gt(0);
            })
        });

        context('when instantiating moduleregistry with manual registry', ()=>{
            it('should return item in list',()=>{
                var result = mut(x=>
                    x.pathToRoot(path.resolve('./'))
                        .for('logger').require('/tests/TestModules/loggerMock')
                        .complete());
                var logger = result.dependencies.find(x=>x.name == 'logger');
                logger.path.must.equal(path.resolve('./tests/TestModules/loggerMock'));
            })
        });

        context('when instantiating moduleregistry with overrride', ()=>{
            it('should return item in overrides',()=>{
                var result = mut(x=>
                    x.pathToRoot(path.resolve('./'))
                        .for('logger').renameTo('damnLogger')
                        .complete());
                var logger = result.overrides.find(x=>x.name == 'damnLogger');
                demand(logger);
            })
        });

    });
});
