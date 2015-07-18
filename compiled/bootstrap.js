/**
 * Created by rharik on 6/23/15.
 */
'use strict';

var _container = require('./index');

module.exports = new _container(function (x) {
  return x.pathToRoot(__dirname).requireDirectory('./src').replace('lodash').withThis('_').replace('bluebird').withThis('Promise').complete();
});