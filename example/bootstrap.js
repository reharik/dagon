/**
 * Created by rharik on 6/23/15.
 */
var _container = require('DAGon');

module.exports = new _container(x=>
    x.pathToRoot(__dirname)
        .for('logger').requireInternalModule('./loggerMock')
        .rename('lodash').withThis('_')
        .rename('bluebird').withThis('Promise')
        .complete());
