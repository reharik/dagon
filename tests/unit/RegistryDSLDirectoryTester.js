/**
 * Created by rharik on 7/1/15.
 */

var demand = require('must');
var path = require('path');

describe('Registry DSL directory Tester', function() {
    var Mut;
    var mut;

    before(function(){
        Mut = require('../../src/containerModules/RegistryDSL');
    });

    beforeEach(function(){
        mut = new Mut()
    });

    describe('#testing directory DSL', function() {
        context('when calling requireDirectory with no value', function () {
            it('should throw proper error', function () {
                var error = '';
                try{
                    mut.requireDirectory()
                }catch(ex){
                    error = ex.message;
                }
                error.must.contain('You must provide a valid directory');
            })
        });

        context('when calling requireDirectory with value', function () {
            it('should create dependencyDeclarations for each item', function () {
                mut.pathToRoot(path.resolve('./')).requireDirectory('/tests/unit');
                mut.dependencyDeclarations.length.must.be.gt(1);
                var result = mut.dependencyDeclarations.filter(x=>x.name == 'RegistryDSLTester');
                result[0].must.not.be.null();
                result[0].path.must.equal(path.resolve('./tests/unit/RegistryDSLTester'));
            })
        });

        context('when calling requireDirectoryRecursively with no value', function () {
            it('should throw proper error', function () {
                var error = '';
                try{
                    mut.requireDirectoryRecursively()
                }catch(ex){
                    error = ex.message;
                }
                error.must.contain('You must provide a valid directory');
            })
        });

        context('when calling requireDirectoryRecursively with value', function () {
            it('should create dependencyDeclarations for each item', function () {
                mut.pathToRoot(path.resolve('./')).requireDirectoryRecursively('./tests/unit');
                mut.dependencyDeclarations.length.must.be.gt(1);
                var result = mut.dependencyDeclarations.filter(x=>x.name == 'RegistryDSLTester');
                result[0].must.not.be.null();
                result[0].name.must.equal('RegistryDSLTester');
            })
        });

        context('when calling groupAllInDirectory with no Directory value', function () {
            it('should throw proper error', function () {
                var error = '';
                try{
                    mut.groupAllInDirectory()
                }catch(ex){
                    error = ex.message;
                }
                error.must.contain('You must provide a valid directory');
            })
        });

        context('when calling groupAllInDirectory with value but no groupname', function () {
            it('should create dependencyDeclarations with groupname of the dir for each item', function () {
                mut.pathToRoot(path.resolve('./')).groupAllInDirectory('/tests/unit');
                mut.dependencyDeclarations.length.must.be.gt(1);
                var result = mut.dependencyDeclarations.filter(x=>x.name == 'RegistryDSLTester');
                result[0].must.not.be.null();
                result[0].groupName.must.equal('unit');
            })
        });

        context('when calling groupAllInDirectory with value', function () {
            it('should create dependencyDeclarations with groupname for each item', function () {
                mut.pathToRoot(path.resolve('./')).groupAllInDirectory('/tests/unit','groupTest');
                mut.dependencyDeclarations.length.must.be.gt(1);
                var result = mut.dependencyDeclarations.filter(x=>x.name == 'RegistryDSLTester');
                result[0].must.not.be.null();
                result[0].groupName.must.equal('groupTest');
            })
        });
    });
});
