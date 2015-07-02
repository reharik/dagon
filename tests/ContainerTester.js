/**
 * Created by rharik on 7/1/15.
 */

var demand = require('must');

describe('Container Test', function() {
    var Mut;

    before(function(){
        Mut = require('../src/Container');
    });

    describe('#instantiate Container', function() {
        context('when instantiating Container without reg func', function () {
            it('should throw proper error', function () {
                (function(){new Mut()}).must.throw(Error,'Invariant Violation: Container requires a registry function');
            })
        });

        context('when instantiating Container WITH reg func', ()=> {
            it('should NOT throw registry func error', ()=> {
                (function(){new Mut(x=>x.pathToPackageJson('../package.json'))}).must.not.throw(Error,'Invariant Violation: Container requires a registry function');
            })
        });

        context('when instantiating Container', ()=> {
            it('should put new grpah on dependencyGraph property', ()=> {
                var mut = new Mut(x=>x.pathToPackageJson('../package.json').complete());
                demand(mut.dependencyGraph);
            })
        });

        context('when instantiating contaienr', ()=>{
            it('should apply registry to graph',()=>{

                var mut = new Mut(x=>
                    x.pathToPackageJson('../package.json')
                        .forDependencyParam('logger').requireThisModule('./TestModules/loggerMock')
                        .complete());
                var logger = mut.dependencyGraph.find(x=>x.name == 'logger');
                logger.debug('is a mock').must.equal('is a mock');

            })
        })

    });
});