/**
 * Created by rharik on 7/1/15.
 */

var demand = require('must');
var path = require('path');

describe('Registry DSL Tester', function() {
    var Mut;
    var mut;

    before(function(){
        Mut = require('../../src/containerModules/RegistryDSL');
    });

    beforeEach(function(){
        mut = new Mut();
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
                mut._pathToAppRoot.must.equal(path.join(path.resolve('./')));
            })
        });

        context('when calling forDependency with no value', function () {
            it('should throw proper error', function () {
                var error = '';
                try{
                    mut.for()
                }catch(ex){
                    error = ex.message;
                }
                error.must.contain('You must provide a valid dependency parameter');
            })
        });

        context('when calling forDependency with proper value', function () {
            it('should set the name value on the decInProgress object', function () {
                mut.pathToRoot(path.resolve('./'));
                mut.for('someParam');
                mut._declarationInProgress.name.must.equal('someParam');
            })
        });

        context('when calling require with no value', function () {
            it('should throw proper error', function () {
                var error = '';
                try{
                    mut.require()
                }catch(ex){
                    error = ex.message;
                }
                error.must.contain('You must provide a valid replacement module');
            })
        });

        context('when calling require with proper value', function () {
            it('should set the path value on the dependency', function () {
                mut.pathToRoot(path.resolve('./'));
                mut.for('someParam');
                mut.require('/tests/TestModules/TestClass');
                mut.complete();
                mut.overrideDeclarations[0].path.must.equal(path.resolve('./tests/TestModules/TestClass'));
            })
        });

      context('when calling normalizeName with standardNormalizer', function () {
        it('should normalize then name by removing the -', function () {
          mut.pathToRoot(path.resolve('./'));
          mut.complete();
          mut.dependencyDeclarations.find(x => x.path === 'fn-args').name.must.equal('fnargs');
        })
      });

      context('when calling normalizeName with customNormalizer', function () {
        it('should normalize then name by replacing the - with *', function () {
          mut.pathToRoot(path.resolve('./'));
          mut.setNormalizeNameStrategy((orig) => {
            var name = orig.replace(/-/g, '*');
            name = name.replace(/\./g, '_');
            return name;
          });

          mut.complete();
          mut.dependencyDeclarations.find(x => x.path === 'fn-args').name.must.equal('fn*args');
        })
      });


      context('when calling normalizeName with camelCaseNormalizer', function () {
        it('should normalize then name by making it camelcase', function () {
          mut.pathToRoot(path.resolve('./'));
          mut.setNormalizeNameStrategy((orig) => {
            var name =  orig.toLowerCase().replace(/-(.)/g, (match, group1) => group1.toUpperCase());
            name = name.replace(/\./g, '_');
            return name;
          });

          mut.complete();
          mut.dependencyDeclarations.find(x => x.path === 'fn-args').name.must.equal('fnArgs');
        })
      });

        context('when calling require with out calling forDependency first', function () {
            it('should throw proper error', function () {
                var error = '';
                try{
                    mut.require('/package.json')
                }catch(ex){
                    error = ex.message;
                }
                error.must.contain('You must call "for" before calling "require"');
            })
        });

        context('when calling require ', function () {
            it('should add object to dependencyDeclaration collection', function () {
                mut.pathToRoot(path.resolve('./'));
                mut.for('someParam');
                mut.require('/tests/TestModules/TestClass');
                mut.complete();
                demand(mut.overrideDeclarations[0]).not.be.null();
            })
        });

        context('when calling requireInternalModule ', function () {
            it('should add internal Dependency', function () {
                mut.pathToRoot(path.resolve('./'));
                mut.for('someParam');
                mut.require('/tests/TestModules/TestClass');
                mut.complete();
                mut.overrideDeclarations[0].internal.must.be.true();
            })
        });


        context('when calling require ', function () {
            it('should reset _declarationInProgress to null', function () {
                mut.pathToRoot(path.resolve('./'));
                mut.for('someParam');
                mut.require('/tests/TestModules/TestClass');
                demand(mut._declarationInProgress).be.null;
            })
        });

        context('when calling replace', function (){
            it('should set property on nameInProgress ', function(){
                mut.for('someParam');
                mut.renameTo('newname');
                mut._declarationInProgress.newName.must.equal('newname');
            });
        });

        ///
        ///
        ///we are not instantiating here anymore

        //context('when calling instantiate with out first calling for',()=>{
        //    it('should throw proper error', function(){
        //        var error = '';
        //        try{
        //            mut.instantiate(x=>x.asClass())
        //        }catch(ex){
        //            error = ex.message;
        //        }
        //        error.must.equal('You must call "for" before calling "instantiate"');
        //    });
        //});

        //context('when calling instantiate',()=>{
        //    it('should return results of func', ()=>{
        //        mut.for('some depemdency').instantiate(x=>x.asClass().withParameters(['someParam']).initializeWithMethod('method'));
        //        mut._declarationInProgress.instantiate.must.eql({dependencyType:'class', parameters:['someParam'], initializationMethod:'method'});
        //    })
        //});
        //
        //context('when calling complete with one rename, and one declaration', function () {
        //    it('should return object with proprer properties', function () {
        //        mut.pathToRoot(path.resolve('./'));
        //        mut.for('someParam');
        //        mut.require('/tests/TestModules/TestClass');
        //        mut.renameTo('newNmae');
        //        var result = mut.complete();
        //        result.dependencyDeclarations.length.must.equal(1);
        //        result.pathToAppRoot.must.be.string();
        //    })
        //});
    });
});
