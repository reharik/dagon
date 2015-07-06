/**
 * Created by rharik on 6/23/15.
 */
var bootstrapper = require('./src/Container');

module.exports = new bootstrapper(x=>
        x.pathToPackageJson('/package.json')
        .forDependencyParam('logger').requireThisInternalModule("/tests/TestModules/loggerMock")
        .replace('lodash').withThis('_')
        .replace('bluebird').withThis('Promise')
        .complete());
