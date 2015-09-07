/**
 * Created by rharik on 7/13/15.
 */

'use strict';

var _logger = require('./yowlWrapper');
var extend = require('extend');
var moment = require('moment');
module.exports = function (_options) {
    var options = {};
    extend(options, _options || {});
    if (options.logger) {
        var level = options.logger.level || 'silly';
        _logger.addConsoleSink({
            level: level,
            colorize: true,
            formatter: function formatter(x) {
                return '[' + x.meta.level + '] module: DAGon msg: ' + x.meta.message + ' | ' + moment().format('h:mm:ss a');
            }
        }).info("added Console Sink");
    }

    return require('./Container');
};