/**
 * Created by rharik on 6/23/15.
 */
var _container = require('dependz');

module.exports = new _container(x=>
    x.pathToRoot(__dirname)
        .requireDirectory('/tests/TestModules')
        .requireDirectoryRecursively('/tests/TestModules')
        .groupAllInDirectory('/tests/TestModules', 'name')
            .for('logger').requireInternalModule('./loggerMock')
            .rename('lodash').withThis('_')
            .rename('bluebird').withThis('Promise')
            .complete());
