/**
 * Created by rharik on 6/23/15.
 */
var _container = require('./index');

module.exports = new _container(x=>
    x.pathToRoot(__dirname)
            .requireDirectory('./src')
            .rename('lodash').withThis('_')
            .rename('bluebird').withThis('Promise')
            .complete());
