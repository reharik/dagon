///**
// * Created by parallels on 9/10/15.
// */
//
//var demand = require('must');
//var path = require('path');
//var moment = require('moment');
//
//describe('instantiateInstance Test', function() {
//    var Mut;
//
//    before(function() {
//        Mut        = require('../src/instantiateInstance');
//        //var logger = require('../src/logger');
//        //if(!logger.exposeInternals().options.console.formatter){
//        //    logger.addConsoleSink({
//        //        level    : 'silly',
//        //        colorize : true,
//        //        formatter: function(x) {
//        //            return '[' + x.meta.level + '] module: DAGon msg: ' + x.meta.message + ' | ' + moment().format('h:mm:ss a');
//        //        }
//        //    }).info("added Console Sink");
//        //}
//    });
//
//    describe('#instantiateInstance', function() {
//        context('when calling instantiateInstance with no item provided', function() {
//            it('should throw proper error', function() {
//                (function() {
//                    Mut()
//                }).must.throw(Error, 'Invariant Violation: You must supply an item to instantiate.');
//            })
//        });
//
//        context('when calling instantiateInstance with item that has no wrapped instance', function() {
//            it('should throw proper error', function() {
//                (function() {
//                        Mut({name: 'frank'})
//                }).must.throw(Error, 'Invariant Violation: You can not instantiate a dependency with no WrappedInstance. item: frank');
//            })
//        });
//
//        context('when calling instantiateInstance with no graph provided', function() {
//            it('should throw proper error', function() {
//                (function() {
//                    Mut({wrappedInstance:function(){
//                    //no-op
//                    }})
//                }).must.throw(Error, 'Invariant Violation: You must supply an array of dependencies even if its empty.');
//            })
//        });
//
//        context('when calling instantiateInstance with empty graph', function() {
//            it('should instantiate the wrapper function', function() {
//                var item = {
//                    name           : 'item',
//                    wrappedInstance: function() {
//                        return {name: 'wrapped'}
//                    }
//                };
//                Mut(item, []).name.must.be('wrapped');
//            })
//        });
//
//        context('when calling instantiateInstance with graph of resolved dependencies', function() {
//            it('should instantiate the wrapper function with the dependencies', function() {
//                var item   = {
//                    name           : 'item',
//                    wrappedInstance: function(dep1, dep2) {
//                        return {
//                            name: 'wrapped',
//                            dep1: dep1(),
//                            dep2: dep2()
//                        }
//                    }
//                };
//                var graph  = [
//                    function() {
//                        return 'dep1'
//                    },
//                    function() {
//                        return 'dep2'
//                    }
//                ];
//                var result = Mut(item, graph);
//                result.must.be.object();
//                result.dep1.must.be('dep1');
//                result.dep2.must.be('dep2');
//            })
//        });
//
//        context('when calling instantiateInstance instantiate as func', function() {
//            it('should instantiate the wrapper function and then call the func', function() {
//                var item = {
//                        name: 'item',
//                    instantiate:{dependencyType:'func'},
//                    wrappedInstance: function(dep1, dep2) {
//                        return function() {
//                            return {
//                                name: 'wrapped',
//                                dep1: dep1(),
//                                dep2: dep2()
//                            }
//                        }
//                    }
//                };
//                var graph  = [
//                    function() {
//                        return 'dep1'
//                    },
//                    function() {
//                        return 'dep2'
//                    }
//                ];
//                var result = Mut(item, graph);
//                result.must.be.object();
//                result.dep1.must.be('dep1');
//                result.dep2.must.be('dep2');
//            })
//        });
//
//        context('when calling instantiateInstance instantiate as func with params', function() {
//            it('should instantiate the wrapper function and then call the func with the params', function() {
//                var item = {
//                    name: 'item',
//                    instantiate:{dependencyType:'func',
//                    parameters:[
//                            function() {
//                                return 'dep1'
//                            },
//                            function() {
//                                return 'dep2'
//                            }
//                    ]},
//                    wrappedInstance: function() {
//                        return function(dep1, dep2) {
//                            return {
//                                name: 'wrapped',
//                                dep1: dep1(),
//                                dep2: dep2()
//                            }
//                        }
//                    }
//                };
//
//                var result = Mut(item, []);
//                result.must.be.object();
//                result.dep1.must.be('dep1');
//                result.dep2.must.be('dep2');
//            })
//        });
//
//
//        context('when calling instantiateInstance instantiate as class', function() {
//            it('should instantiate the wrapper function and then call the class', function() {
//                var item = {
//                    name: 'item',
//                    instantiate:{dependencyType:'class'},
//                    wrappedInstance: function(dep1, dep2) {
//                        return class test {
//                            constructor(){
//                                return {
//                                    name: 'wrapped',
//                                    dep1: dep1(),
//                                    dep2: dep2()
//                                }
//                            }
//                        }
//                    }
//                };
//                var graph  = [
//                    function() {
//                        return 'dep1'
//                    },
//                    function() {
//                        return 'dep2'
//                    }
//                ];
//                var result = Mut(item, graph);
//                result.must.be.object();
//                result.dep1.must.be('dep1');
//                result.dep2.must.be('dep2');
//            })
//        });
//
//        context('when calling instantiateInstance instantiate as class', function() {
//            it('should instantiate the wrapper function and then call the class', function() {
//                var item = {
//                    name: 'item',
//                    instantiate:{dependencyType:'class',
//                        parameters:[
//                            function() {
//                                return 'dep1'
//                            },
//                            function() {
//                                return 'dep2'
//                            }
//                        ]},
//                    wrappedInstance: function() {
//                        return class test {
//                            constructor(dep1, dep2){
//                                return {
//                                    name: 'wrapped',
//                                    dep1: dep1(),
//                                    dep2: dep2()
//                                }
//                            }
//                        }
//                    }
//                };
//                var graph  = [
//                    function() {
//                        return 'dep1'
//                    },
//                    function() {
//                        return 'dep2'
//                    }
//                ];
//                var result = Mut(item, []);
//                result.must.be.object();
//                result.dep1.must.be('dep1');
//                result.dep2.must.be('dep2');
//            })
//        });
//
//        context('when calling instantiateInstance with instantiate intialize', function() {
//            it('should instantiate the wrapper function call the function then call the initialize method', function() {
//                var item   = {
//                    name           : 'item',
//                    instantiate    : {
//                        dependencyType      : 'func',
//                        parameters          : [
//                            function() {
//                                return 'dep1'
//                            },
//                            function() {
//                                return 'dep2'
//                            }
//                        ],
//                        initializationMethod: 'init'
//                    },
//                    wrappedInstance: function() {
//                        return function(dep1, dep2) {
//                            return {
//                                 init: function() {
//
//                                    return {
//                                        name: 'wrapped',
//                                        dep1: dep1(),
//                                        dep2: dep2()
//                                    }
//                                }
//                            }
//                        }
//                    }
//                };
//
//                var result = Mut(item, []);
//                result.must.be.object();
//                result.dep1.must.be('dep1');
//                result.dep2.must.be('dep2');
//
//            })
//        });
//
//        context('when calling instantiateInstance with instantiate intialize', function() {
//            it('should instantiate the wrapper function call the function then call the initialize method with the init params', function() {
//                var item   = {
//                    name           : 'item',
//                    instantiate    : {
//                        dependencyType      : 'func',
//                        parameters          : [
//                            function() {
//                                return 'dep1'
//                            },
//                            function() {
//                                return 'dep2'
//                            }
//                        ],
//                        initializationMethod: 'init',
//                        initParameters:[
//                            1,2
//                        ]
//                    },
//                    wrappedInstance: function() {
//                        return function(dep1, dep2) {
//                            return {
//                                init: function(one, two) {
//
//                                    return {
//                                        name: one + two,
//                                        dep1: dep1(),
//                                        dep2: dep2()
//                                    }
//                                }
//                            }
//                        }
//                    }
//                };
//
//                var result = Mut(item, []);
//                result.must.be.object();
//                result.name.must.be(3);
//                result.dep1.must.be('dep1');
//                result.dep2.must.be('dep2');
//            })
//        });
//    });
//
//});
