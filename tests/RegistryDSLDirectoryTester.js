/**
 * Created by rharik on 7/1/15.
 */

var demand = require('must');
var path = require('path');

describe('Registry DSL directory Tester', function() {
    var Mut;
    var mut;

    before(function(){
        Mut = require('../src/RegistryDSL');
    });

    beforeEach(function(){
        mut = new Mut()
    });

    describe('#testing directory DSL', function() {
        context('when calling requireDirectory with no value', function () {
            it('should throw proper error', function () {
                (function(){mut.requireDirectory()}).must.throw(Error, 'Invariant Violation: You must provide a valid directory');
            })
        });

        context('when calling requireDirectory with value', function () {
            it('should create dependencyDeclarations for each item', function () {
                mut.pathToRoot(path.resolve('./')).requireDirectory('/tests');
                mut.dependencyDeclarations.length.must.be.gt(1);
                var result = mut.dependencyDeclarations.filter(x=>x.name == 'RegistryDSLTester');
                result[0].must.not.be.null();
                result[0].path.must.equal(path.resolve('./tests/RegistryDSLTester'));
            })
        });

        context('when calling requireDirectoryRecursively with no value', function () {
            it('should throw proper error', function () {
                (function(){mut.requireDirectoryRecursively()}).must.throw(Error, 'Invariant Violation: You must provide a valid directory');
            })
        });

        context('when calling requireDirectoryRecursively with value', function () {
            it('should create dependencyDeclarations for each item', function () {
                mut.pathToRoot(path.resolve('./')).requireDirectoryRecursively('./tests');
                mut.dependencyDeclarations.length.must.be.gt(1);
                var result = mut.dependencyDeclarations.filter(x=>x.name == 'RegistryDSLTester');
                result[0].must.not.be.null();
                result[0].name.must.equal('RegistryDSLTester');
            })
        });

        context('when calling groupAllInDirectory with no Directory value', function () {
            it('should throw proper error', function () {
                (function(){mut.groupAllInDirectory()}).must.throw(Error, 'Invariant Violation: You must provide a valid directory');
            })
        });

        context('when calling groupAllInDirectory with no groupName value', function () {
            it('should throw proper error', function () {
                (function(){mut.groupAllInDirectory('someDir')}).must.throw(Error, 'Invariant Violation: You must provide a valid Group Name');
            })
        });

        context('when calling groupAllInDirectory with no directory value', function () {
            it('should throw proper error', function () {
                (function(){mut.groupAllInDirectory()}).must.throw(Error, 'Invariant Violation: You must provide a valid directory');
            })
        });

        context('when calling groupAllInDirectory with value', function () {
            it('should create dependencyDeclarations with groupname for each item', function () {
                mut.pathToRoot(path.resolve('./')).groupAllInDirectory('/tests','groupTest');
                mut.dependencyDeclarations.length.must.be.gt(1);
                var result = mut.dependencyDeclarations.filter(x=>x.name == 'RegistryDSLTester');
                result[0].must.not.be.null();
                result[0].groupName.must.equal('groupTest');
            })
        });

    });
});
