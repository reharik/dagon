/**
 * Created by rharik on 6/23/15.
 */
var _container = require('dependz');

module.exports = new _container(x=>
    x.pathToRoot(__dirname)
        .requireDirectory('/tests/TestModules')
        .requireDirectoryRecursively('/tests/TestModules')
        .groupAllInDirectory('/tests/TestModules', 'name');
            .forDependencyParam('logger').requireThisInternalModule('./loggerMock')
            .replace('lodash').withThis('_')
            .replace('bluebird').withThis('Promise')
            .complete());
