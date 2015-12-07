/**
 * Created by reharik on 12/6/15.
 */


var ContainerDSL = require('./ContainerDSL');
var logger = require('./logger');
var exceptionHandler = require('./exceptionHandler');
var moduleRegistry = require('./moduleRegistry');
var R = require('ramda');

var builder = function(registryFunc, containerFunc){

    var dto = moduleRegistry(registryFunc);
    var dependencies = cleanUpDependencies(dto);

    return containerFunc(new ContainerDSL(dependencies));
};

var cleanUpDependencies = function(dto){

}

var compareDependencies = function(a,b){
    //if(a.name == b.name
    //&& a.path == b.path
}