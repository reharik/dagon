/**
 * Created by rharik on 6/23/15.
 */
var _container = require('dependz');

module.exports = new _container(x=>
    x.pathToPackageJson('/package.json')
            .forDependencyParam('logger').requireThisInternalModule('./loggerMock')
            .replace('lodash').withThis('_')
            .replace('bluebird').withThis('Promise')
            .complete());
