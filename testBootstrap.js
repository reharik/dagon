/**
 * Created by rharik on 6/23/15.
 */
var bootstrapper = require('./src/IOC/bootstrapper');

module.exports = function(){
    var container = container ? container
        : bootstrapper.initialize(x=>
        x.pathToJsonConfig('./package.json')
        .forDependencyParam('testAgg').requireThisModule("/unitTests/mocks/testAgg")
        .forDependencyParam('testAggNoCMDHandlers').requireThisModule("/unitTests/mocks/testAggNoCMDHandlers")
        .forDependencyParam('testAggNoEventHandlers').requireThisModule("/unitTests/mocks/testAggNoEventHandlers")
        .forDependencyParam('TestEventHandler').requireThisModule("/unitTests/mocks/TestEventHandler")
        .forDependencyParam('gesclient').requireThisModule("/unitTests/mocks/gesClientMock")
        .replace('lodash').withThis('_')
        .replace('bluebird').withThis('Promise')
        .complete());
    return container;
}();
