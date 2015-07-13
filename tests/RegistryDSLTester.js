/**
 * Created by rharik on 7/1/15.
 */

var demand = require('must');
var path = require('path');
var Dependency = require('../src/Dependency');

describe('Registry DSL Tester', function() {
    var Mut;
    var mut;

    before(function(){
        Mut = require('../src/RegistryDSL');
    });

    beforeEach(function(){
        mut = new Mut()
    });

    describe('#testing DSL', function() {
        context('when calling pathToJson with no value', function () {
            it('should throw proper error', function () {
                (function(){mut.pathToRoot()}).must.throw(Error);
            })
        });

        context('when calling pathToJson with propervalue', function () {
            it('should set the path field value', function () {
                mut.pathToRoot(path.resolve('./'));
                mut._pathToPackageJson.must.equal(path.join(path.resolve('./'),  'package.json'));
            })
        });

        context('when calling forDependency with no value', function () {
            it('should throw proper error', function () {
                (function(){mut.forDependencyParam()}).must.throw(Error,'Invariant Violation: You must provide a valid dependency parameter');
            })
        });

        context('when calling forDependency with proper value', function () {
            it('should set the name value on the decInProgress object', function () {
                mut.pathToRoot(path.resolve('./'));
                mut.forDependencyParam('someParam');
                mut._declarationInProgress.name.must.equal('someParam');
            })
        });

        context('when calling requireThisModule with no value', function () {
            it('should throw proper error', function () {
                (function(){mut.requireThisModule()}).must.throw(Error,'Invariant Violation: You must provide a valid replacement module');
            })
        });

        context('when calling requireThisModule with proper value', function () {
            it('should set the path value on the dependency', function () {
                mut.pathToRoot(path.resolve('./'));
                mut.forDependencyParam('someParam');
                mut.requireThisInternalModule('/tests/TestModules/TestClass');
                mut.dependencyDeclarations[0].path.must.equal('/tests/TestModules/TestClass');
            })
        });

        context('when calling requireThisModule with out calling forDependency first', function () {
            it('should throw proper error', function () {
                (function(){mut.requireThisModule('/package.json')})
                    .must.throw(Error,'Invariant Violation: You must call "forDependencyParam" before calling "requireThisModule"');
            })
        });

        context('when calling requireThisModule ', function () {
            it('should add object to dependencyDeclaration collection', function () {
                mut.pathToRoot(path.resolve('./'));
                mut.forDependencyParam('someParam');
                mut.requireThisInternalModule('/tests/TestModules/TestClass');
                demand(mut.dependencyDeclarations[0]).not.be.null;
            })
        });

        context('when calling requireThisModule ', function () {
            it('should add object of type Dependency dependencyDeclaration collection', function () {
                mut.pathToRoot(path.resolve('./'));
                mut.forDependencyParam('someParam');
                mut.requireThisInternalModule('/tests/TestModules/TestClass');
                mut.dependencyDeclarations[0].must.be.instanceOf(Dependency);
            })
        });

        context('when calling requireThisInternalModule ', function () {
            it('should add internal Dependency', function () {
                mut.pathToRoot(path.resolve('./'));
                mut.forDependencyParam('someParam');
                mut.requireThisInternalModule('/tests/TestModules/TestClass');
                mut.dependencyDeclarations[0].internal.must.be.true();
            })
        });


        context('when calling requireThisModule ', function () {
            it('should reset _declarationInProgress to null', function () {
                mut.pathToRoot(path.resolve('./'));
                mut.forDependencyParam('someParam');
                mut.requireThisInternalModule('/tests/TestModules/TestClass');
                demand(mut._declarationInProgress).be.null;
            })
        });

        context('when calling replace with no param ', function () {
            it('should should throw proper error', function () {
               (function(){mut.replace()}).must.throw(Error, 'Invariant Violation: You must provide the name of the your dependency');
            });
        });

        context('when calling replace', function (){
            it('should set property on nameInProgress ', function(){
                mut.replace('oldname');
                mut._renameInProgress.oldName.must.equal('oldname');
            });
        });

        context('when calling "withThis" with out new name', function (){
            it('should throw propper error', function(){
                (function(){mut.withThis()}).must.throw(Error, 'Invariant Violation: You must provide the new name');
            });
        });

        context('when calling "withThis with out calling "replace" first', function () {
            it('should throw proper error', function () {
                (function(){mut.withThis('./somepath')}).must.throw(Error,'Invariant Violation: You must call "replace" before calling "withThis"');
            })
        });

        context('when calling "withThis', function () {
            it('should add object to renamedDeclarations collection', function () {
                mut.replace('someParam');
                mut.withThis('newName');
                demand(mut.renamedDeclarations[0]).not.be.null;
            })
        });

        context('when calling "withThis', function () {
            it('should reset renameInProgress to null', function () {
                mut.replace('someParam');
                mut.withThis('newNmae');
                demand(mut.renamedDeclarations).be.null;
            })
        });

        context('when calling complete with no pathToRoot', function () {
            it('should throw Proper error', function () {
                (function(){mut.complete()}).must.throw(Error,'Invariant Violation: You must provide a path to your package.json before calling complete');
            })
        });

        context('when calling complete with one rename, and one declaration', function () {
            it('should return object with proprer properties', function () {
                mut.replace('someParam');
                mut.withThis('newNmae');
                mut.pathToRoot(path.resolve('./'));
                mut.forDependencyParam('someParam');
                mut.requireThisInternalModule('/tests/TestModules/TestClass');
                var result = mut.complete();
                result.dependencyDeclarations.length.must.equal(1);
                result.renamedDeclarations.length.must.equal(1);
                result.pathToPackageJson.must.be.string()
            })
        });
    });
});
