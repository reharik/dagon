/**
 * Created by rharik on 6/23/15.
 */
'use strict';

var _container = require('dependz');

module.exports = new _container(function (x) {
  return x.pathToRoot(__dirname).forDependencyParam('logger').requireThisInternalModule('./loggerMock').replace('lodash').withThis('_').replace('bluebird').withThis('Promise').complete();
});