/**
 * Created by rharik on 6/23/15.
 */
var bootstrapper = require('./src/Container');

module.exports = new bootstrapper(x=>
        x.pathToRoot(__dirname)
        .for('logger').require("tests/TestModules/loggerMock")
        .rename('lodash').withThis('_')
        .rename('bluebird').withThis('Promise')
        .complete());
