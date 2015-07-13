/**
 * Created by rharik on 7/2/15.
 */
var demand = require('must');
var Graph = require('../src/Graph');
var RegistryDSL = require('../src/RegistryDSL');
var path = require('path');
describe('ApplyRegistry Tester', function() {
    var mut;

    beforeEach(function(){
        mut = require('../src/applyRegistry');
    });

    describe('#testing apply', function() {
        context('when calling applyRegistry with no registry param', function () {
            it('should throw proper error', function () {
                (function(){mut()}).must.throw(Error,'Invariant Violation: Must provide a registry');
            })
        });

        context('when calling applyRegister with no graph param', ()=>{
            it('should throw proper error', ()=>{
                (function(){mut({})}).must.throw(Error, 'Invariant Violation: Must provide a graph');
            });
        });

        context('when calling applyRegister with one replacement dependency', ()=>{
            it('should replace dependency', ()=>{
                var graph = new Graph(path.resolve('./'));
                var packageJson =  require('../package.json');
                graph.buildGraph(packageJson);

                var reg = new RegistryDSL()
                    .pathToRoot(path.resolve('./'))
                    .forDependencyParam('logger')
                    .requireThisModule('/tests/TestModules/loggerMock')
                    .complete();
                mut(reg, graph);
                var logger = graph._items.find(x=>x.name == 'logger');
                logger.path.must.equal('/tests/TestModules/loggerMock');
            });
        });

        context('when calling applyRegister with explicit dependency but not replacing', ()=>{
            it('should add that dependency to graph', ()=>{
                var graph = new Graph(path.resolve('./'));
                var packageJson =  require('../package.json');
                graph.buildGraph(packageJson);

                var reg = new RegistryDSL()
                    .pathToRoot(path.resolve('./'))
                    .forDependencyParam('TestClass')
                    .requireThisModule('/tests/TestModules/TestClass')
                    .complete();
                mut(reg, graph);
                var logger = graph._items.find(x=>x.name == 'TestClass');
                demand(logger);
            });
        });

        context('when calling applyRegister with one rename', ()=>{
            it('should rename dependency', ()=>{
                var graph = new Graph(path.resolve('./'));
                var packageJson =  require('../package.json');
                graph.buildGraph(packageJson);

                var reg = new RegistryDSL()
                    .pathToRoot(path.resolve('./'))
                    .replace('lodash')
                    .withThis('_')
                    .complete();
                mut(reg, graph);
                var item = graph._items.find(x=>x.name == '_');
                demand(item);
                var lodash = graph._items.find(x=>x.name == 'lodash');
                demand(lodash).be.null;
            });
        });


    });


});
