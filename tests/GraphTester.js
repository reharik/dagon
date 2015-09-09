///**
// * Created by rharik on 7/2/15.
// */
//var demand = require('must');
//var Dependency = require('../src/Dependency');
//var Container = require('../src/Container');
//var path = require('path');
//var logger = require('../src/logger');
//var RegistryDSL = require('../src/RegistryDSL');
//var GraphResolution = require('../src/graphResolver');
//
//describe('Graph Tester', function() {
//    var Mut;
//    var mut;
//
//    before(function () {
//        Mut = require('../src/groupDependencies');
//    });
//
//    beforeEach(function () {
//        mut = new Mut();
//    });
//
//    describe('#testing buildgrpah', function () {
//        context('when calling buildGraph with no value', function () {
//            it('should throw proper error', function () {
//                (function () {
//                    mut.buildGraph()
//                }).must.throw(Error, 'Invariant Violation: You must provide a json object to build graph from');
//            })
//        });
//
//        context('when calling buildGraph with no dependencies', function () {
//            it('should not throw error', function () {
//                (function () {
//                    mut.buildGraph({})
//                }).must.not.throw(Error);
//
//            })
//        });
//
//        context('when calling buildGraph with no internal dependencies', function () {
//            it('should not throw error', function () {
//                (function () {
//                    mut.buildGraph({})
//                }).must.not.throw(Error);
//            })
//        });
//
//        context('when calling buildGraph with dependencies', function () {
//            it('should put dependency on graph', function () {
//                mut.buildGraph({dependencies: {"uuid": "^2.0.1"}});
//                demand(mut._items[0]);
//            })
//        });
//
//        context('when calling buildGraph with dependencies', function () {
//            it('should add type of Dependency to list', function () {
//                mut.buildGraph({dependencies: {"uuid": "^2.0.1"}});
//                mut._items[0].must.be.instanceOf(Dependency);
//            })
//        });
//
//        context('when calling buildGraph with dependencies', function () {
//            it('should add type of Dependency to list', function () {
//                mut.buildGraph({dependencies: {"uuid": "^2.0.1"}});
//                mut._items[0].internal.must.be.false;
//            })
//        });
//
//        context('when calling buildGraph with dependency with hyphen in name', function () {
//            it('should clean name, but not path', function () {
//                mut.buildGraph({dependencies: {"roll-a-dice": "0.0.2"}});
//                mut._items[0].name.must.equal('rolladice');
//                mut._items[0].path.must.equal('roll-a-dice');
//            })
//        });
//
//        context('when calling buildGraph with internal dependency', function () {
//            it('should put dependency on graph', function () {
//                mut.buildGraph({internalDependencies: {"logger": "/src/logger"}});
//                demand(mut._items[0]);
//            });
//        });
//
//        context('when calling buildGraph with internal dependency', ()=> {
//            it('should add type of Dependency to list', ()=> {
//                mut.buildGraph({internalDependencies: {"logger": "/src/logger"}});
//                mut._items[0].must.be.instanceOf(Dependency);
//            });
//        });
//
//        context('when calling buildGraph with internal dependency', ()=> {
//            it('should have correct absolute path', ()=> {
//                mut.buildGraph({internalDependencies: {"logger": "/src/logger"}});
//                mut._items[0].path.must.equal('/src/logger');
//            });
//        });
//
//        context('when calling buildGraph with internal dependency', ()=> {
//            it('should set internal to true on Dependency object', ()=> {
//                mut.buildGraph({internalDependencies: {"logger": "/src/logger"}});
//                mut._items[0].internal.must.be.true;
//            });
//        });
//
//    });
//
//    describe('#testing addItem', function () {
//        context('when calling addItem with no value', function () {
//            it('should throw proper error', function () {
//                (function () {
//                    mut.addItem()
//                }).must.throw(Error, 'Invariant Violation: You must provide a dependency to add');
//            })
//        });
//        context('when calling addItem value', function () {
//            it('should should be of type Dependency', function () {
//                mut.addItem(new Dependency({name: 'something', path: '../src/Container'}));
//                mut._items[0].must.be.instanceOf(Dependency);
//            })
//        });
//
//        context('when calling addItem ', function () {
//            it('should should replace existing item if present', function () {
//                mut.addItem(new Dependency({name: 'something', path: '../src/Container'}));
//                mut.addItem(new Dependency({name: 'something', path: '../src/RegistryDSL'}));
//                mut._items.length.must.equal(1);
//                mut._items[0].path.must.equal('../src/RegistryDSL');
//            })
//        });
//    });
//
//    describe('#testing findDependency', function () {
//        context('when calling findDependency with no value', function () {
//            it('should throw proper error', function () {
//                //mut.buildGraph(require(path.join(path.resolve('./') + '/package.json')));
//                (function () {
//                    mut.findDependency()
//                }).must.throw(Error, 'Invariant Violation: You must provide a dependency name to find');
//            })
//        });
//
//        context('when calling findDependency for dependency that exists', function () {
//            it('should return that resolved dependency', function () {
//                mut.buildGraph(require(path.join(path.resolve('./') + '/package.json')));
//                new GraphResolution().recurse(mut);
//                var logger = mut.findDependency('logger');
//                logger.must.not.be.object;
//            })
//        });
//
//        context('when calling findDependency for dependency that does not exist', function () {
//            it('should not throw', function () {
//                mut.buildGraph(require(path.join(path.resolve('./') + '/package.json')));
//                new GraphResolution().recurse(mut);
//                console.log(mut.findDependency('pig'));
//                (function () {
//                    mut.findDependency('pig')
//                }).must.not.throw(Error);
//            })
//        });
//    });
//
//    describe('#testing findRequiredDependency', function () {
//        context('when calling findRequiredDependency with no value', function () {
//            it('should throw proper error', function () {
//                //mut.buildGraph(require(path.join(path.resolve('./') + '/package.json')));
//                (function () {
//                    mut.findRequiredDependency()
//                }).must.throw(Error, 'Invariant Violation: You must provide a dependency name to find');
//            })
//        });
//
//        context('when calling findRequiredDependency for dependency that exists', function () {
//            it('should return that resolved dependency', function () {
//                mut.buildGraph(require(path.join(path.resolve('./') + '/package.json')));
//                new GraphResolution().recurse(mut);
//                var logger = mut.findRequiredDependency('logger');
//                logger.resolvedInstance.must.not.be.object;
//            })
//        });
//
//        context('when calling findGroupedDependency for dependency that exists', function () {
//            it('should return array of those depnedencies', function () {
//                var Container = require('../src/Container');
//                var cont = new Container(x=>x.pathToRoot(path.resolve('./')).groupAllInDirectory('/tests/TestModules', 'testGroup').complete());
//                var result = cont.dependencyGraph.findGroupedDependencies('testGroup');
//                result.length.must.be.gt(1);
//                result[0].groupName.must.equal('testGroup');
//            })
//        });
//
//        context('when calling findRequiredDependency for dependency that that is not in cache but does exist', function () {
//            it('resolve dependency', function () {
//                mut.buildGraph(require(path.join(path.resolve('./') + '/package.json')));
//                new GraphResolution().recurse(mut);
//                var eventEmitter = mut.findRequiredDependency('events');
//                eventEmitter.resolvedInstance.EventEmitter.must.be.function();
//            })
//        });
//
//    });
//});
