/**
 * Created by parallels on 9/10/15.
 */

var demand = require('must');
var path = require('path');
var moment = require('moment');

describe('buildListOfDependencies Test', function() {
    var Mut;

    before(function() {
        Mut        = require('../src/buildListofDependencies');
        var logger = require('../src/logger');
        if(!logger.exposeInternals().options.console.formatter){
            logger.addConsoleSink({
                level    : 'silly',
                colorize : true,
                formatter: function(x) {
                    return '[' + x.meta.level + '] module: DAGon msg: ' + x.meta.message + ' | ' + moment().format('h:mm:ss a');
                }
            }).info("added Console Sink");
        }
    });

    describe('#buildListOfDependencies', function() {
        context('when calling buildListOfDependencies with no pjson and no manualDeclarations', function() {
            it('should return empty array', function() {
                Mut().must.be.an.array();
            })
        });

        context('when calling buildListOfDependencies WITH pjson and no manualDeclarations', function() {
            it('should return one dependency', function() {
                var pjson = {
                    "dependencies": {
                        "JSON": "^1.0.0"
                    }
                };

                var result = Mut([], pjson,path.resolve('./'));
                result.must.have.length(1);
                result[0].name.must.be('JSON')
            })
        });

        context('when calling buildListOfDependencies with pjson and manualDeclarations to update json', function() {
            it('should return updated dependendy', function() {
                var pjson = {
                    "dependencies": {
                        "JSON": "^1.0.0"
                    }
                };
                var manDec = [
                    {name:'JSON', newName:'pigfr'}
                ];
                var result = Mut(manDec, pjson,path.resolve('./'));
                result.must.have.length(1);
                result[0].name.must.be('pigfr');
            })
        });

        context('when calling buildListOfDependencies with NO pjson and manualDeclarations to create new dependency', function() {
            it('should return new (explicit) dependendy', function() {
                var manDec = [
                    {name:'myDependency', path:'./myDependency'}
                ];
                var result = Mut(manDec,null,path.resolve('./'));
                result.must.have.length(1);
                result[0].name.must.be('myDependency');
                result[0].path.must.be('./myDependency');
            })
        });

        context('when calling buildListOfDependencies with pjson and manualDeclarations to create new dependency', function() {
            it('should concatenate both groups of dependencies', function() {
                var pjson = {
                    "dependencies": {
                        "JSON": "^1.0.0"
                    }
                };

                var manDec = [
                    {name:'myDependency', path:'./myDependency'}
                ];
                var result = Mut(manDec, pjson,path.resolve('./'));
                result.must.have.length(2);
                result[0].name.must.be('JSON');
                result[0].path.must.be('JSON');
                result[1].name.must.be('myDependency');
                result[1].path.must.be('./myDependency');
            })
        });

        context('when calling buildListOfDependencies with pjson with name that needs to be normailized', function() {
            it('should return dependendy with name normailized', function() {
                var pjson = {
                    "dependencies": {
                        "a-great.module.for-you": "^1.0.0"
                    }
                };
                var result = Mut([], pjson,path.resolve('./'));
                result.must.have.length(1);
                result[0].name.must.be('agreat_module_foryou');
            })
        });

        context('when calling buildListOfDependencies with pjson dependency', function() {
            it('should wrap dependency in parameterless function that returns the pjson dependency', function() {
                var pjson = {
                    "dependencies": {
                        "JSON": "^1.0.0"
                    }
                };
                var result = Mut([], pjson,path.resolve('./'));
                result.must.have.length(1);
                result[0].wrappedInstance.must.be.a.function();
                result[0].wrappedInstance.toString().must.startWith('function () {');
                result[0].wrappedInstance.toString().must.contain('return require(item.path)');
            })
        });

        context('when calling buildListOfDependencies with manualDependencies to create dependency', function() {
            it('should require the internal dependency and put it in the wrappedInstance variable', function() {
                var manDec = [
                    {name:'pointlessDependency', path:'/tests/TestModules/pointlessDependency', internal:true}
                ];
                var result = Mut(manDec,null,path.resolve('./') );
                result.must.have.length(1);
                result[0].wrappedInstance.must.be.a.function();
                result[0].wrappedInstance.toString().must.startWith('function (uuid) {');
            })
        });

        context('when calling buildListOfDependencies with manualDependencies to create dependency but its not a wrapped function', function() {
            it('should throw proper error', function() {
                var manDec = [
                    {name:'nonWrappedModule', path:'/tests/nonWrappedModule', internal:true}
                ];
                (function(){new Mut(manDec)}).must.throw(Error);
            })
        });
    });
});

