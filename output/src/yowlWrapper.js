'use strict';

var yowl = require('yowl');
var moment = require('moment');

module.exports = function (options) {
    var _yowl = new yowl({
        system: {
            applicationName: "dagon",
            environment: "dev"
        }
    });
    if (!options) {
        return _yowl;
    }
    var level = options.level ? options.level : 'silly';
    level = level == 'trace' ? 'silly' : level;
    _yowl.addConsoleSink({
        level: level,
        colorize: true,
        formatter: function formatter(x) {
            return '[' + x.meta.level + '] message: ' + x.meta.message + ' | ' + moment().format('h:mm:ss a');
        }
    }).info("added Console Sink");
    return _yowl;
};