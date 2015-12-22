/**
 * Created by rharik on 12/21/15.
 */
var demand = require('must');

describe('INSTANTIATE INSTANCE TESTER', function() {
    var mut;

    before(function() {
        mut        = require('../../src/graphResolution/instantiateInstance');
    });

    describe('#INSTANTIATEINSTANCE FOR CLASS', function() {

        context('when calling instantiateInstance with a item of type class', function () {
            it('should instantiate class', function () {
                var testClass = class testClass {
                    constructor() {
                    }
                };
                var item ={
                    name: 'classItem',
                    resolvedInstance: testClass,
                    instantiate: {
                        dependencyType:'class'
                    }
                };

                mut(item);
                item.resolvedInstance.must.be.an(testClass);
            })
        });

        context('when calling instantiateInstance with a item of type class and class param', function () {
            it('should instantiate class with params', function () {
                var testClass = class testClass {
                    constructor(param1) {
                        this.param = param1;
                    }
                    returnResult = function(){
                        return this.param;
                    }
                };
                var item ={
                    name: 'classItem',
                    resolvedInstance: testClass,
                    instantiate: {
                        dependencyType:'class',
                        parameters:['this is the param']
                    }
                };

                mut(item);
                item.resolvedInstance.must.be.an(testClass);
                item.resolvedInstance.returnResult().must.equal('this is the param');
            })
        });

        context('when calling instantiateInstance with an item of type class and param and intialize func', function () {
            it('should instantiate class with params', function () {
                var testClass = class testClass {
                    constructor(param1) {
                        this.param = param1;
                        this.initVal = '';
                    }
                    initFunc = function(){
                        this.initVal = 'init value';
                    };
                    returnResult = function(){
                        return {param:this.param, init:this.initVal};
                    };
                };
                var item ={
                    name: 'classItem',
                    resolvedInstance: testClass,
                    instantiate: {
                        dependencyType:'class',
                        parameters:['this is the param'],
                        initializationMethod:'initFunc'
                    }
                };

                mut(item);
                item.resolvedInstance.must.be.an(testClass);
                item.resolvedInstance.returnResult().param.must.equal('this is the param');
                item.resolvedInstance.returnResult().init.must.equal('init value');
            })
        });

        context('when calling instantiateInstance with an item of type class and param and init func and init params', function () {
            it('should instantiate class with params', function () {
                var testClass = class testClass {
                    constructor(param1) {
                        this.param = param1;
                        this.initVal = '';
                        this.initFuncParam = '';
                    }
                    initFunc = function(initFunc){
                        this.initVal = 'init value';
                        this.initFuncParam = initFunc;
                    };
                    returnResult = function(){
                        return {param:this.param, init:this.initVal, initFuncParam: this.initFuncParam};
                    };
                };
                var item = {
                    name: 'classItem',
                    resolvedInstance: testClass,
                    instantiate: {
                        dependencyType:'class',
                        parameters:['this is the param'],
                        initializationMethod:'initFunc',
                        initParameters: ['init func param']
                    }
                };

                mut(item);
                item.resolvedInstance.must.be.an(testClass);
                item.resolvedInstance.returnResult().param.must.equal('this is the param');
                item.resolvedInstance.returnResult().init.must.equal('init value');
                item.resolvedInstance.returnResult().initFuncParam.must.equal('init func param');
            })
        });
    });

    describe('#INSTANTIATEINSTANCE FOR FUNC', function() {

        context('when calling instantiateInstance with a item of type ', function () {
            it('should instantiate ', function () {
                var testFunc = function(){
                    return {
                        returnVal: 'this'
                    }
                };
                var item ={
                    name: 'funcItem',
                    resolvedInstance: testFunc,
                    instantiate: {
                        dependencyType:'func'
                    }
                };

                mut(item);
                item.resolvedInstance.must.be.an.object();
                item.resolvedInstance.returnVal.must.equal('this');
            })
        });

        context('when calling instantiateInstance with a item of type func and param', function () {
            it('should instantiate func with params', function () {
                var testFunc = function(param){
                    return {
                        returnVal: 'this',
                        param: param
                    }
                };
                var item ={
                    name: 'funcItem',
                    resolvedInstance: testFunc,
                    instantiate: {
                        dependencyType:'func',
                        parameters:['thisParam']
                    }
                };

                mut(item);
                item.resolvedInstance.must.be.an.object();
                item.resolvedInstance.returnVal.must.equal('this');
                item.resolvedInstance.param.must.equal('thisParam');
            })
        });

        context('when calling instantiateInstance with an item of type func and param and intialize func', function () {
            it('should instantiate func with params', function () {
                var testFunc = function(param){
                    var initFunc = function() {
                        return {
                            returnVal: 'this',
                            param    : param
                        }
                    };
                    return {
                        initFunc
                    }
                };
                var item ={
                    name: 'funcItem',
                    resolvedInstance: testFunc,
                    instantiate: {
                        dependencyType:'func',
                        parameters:['thisParam'],
                        initializationMethod: 'initFunc'
                    }
                };

                mut(item);
                item.resolvedInstance.must.be.an.object();
                item.resolvedInstance.returnVal.must.equal('this');
                item.resolvedInstance.param.must.equal('thisParam');
            })
        });

        context('when calling instantiateInstance with an item of type func and param and init func and init params', function () {
            it('should instantiate class with params', function () {
                var testFunc = function(param){
                    var initFunc = function(initParam) {
                        return {
                            returnVal: 'this',
                            param    : param,
                            initParam: initParam
                        }
                    };
                    return {
                        initFunc
                    }
                };
                var item ={
                    name: 'funcItem',
                    resolvedInstance: testFunc,
                    instantiate: {
                        dependencyType:'func',
                        parameters:['thisParam'],
                        initializationMethod: 'initFunc',
                        initParameters: ['init param']
                    }
                };

                mut(item);
                item.resolvedInstance.must.be.an.object();
                item.resolvedInstance.returnVal.must.equal('this');
                item.resolvedInstance.param.must.equal('thisParam');
                item.resolvedInstance.initParam.must.equal('init param');
            })
        });
    });
});
