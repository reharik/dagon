var winston = require('winston');
var moment = require('moment');

module.exports = function () {
  var transports = [];
    transports.push(
      new (winston.transports.Console)({
        handleExceptions: true,
        prettyPrint: true,
        colorize: true,
        silent: false,
        timestamp: true,
        json: false,
        formatter: function (x) {
          return '[' + x.level + '] ' + ' module: DAGon msg: ' + x.message + ' | ' + moment().format('h:mm:ss a');
        }
      })
    );
  winston.configure({
    transports,
    level: process.env.DAGON_LOGGING_LEVEL || 'error'
  });

  var trace = (message) => {
    winston.silly(message);
  };

  var debug = (message) => {
    winston.debug(message);
  };

  var info = (message) => {
    winston.info(message);
  };

  var warn = (message) => {
    winston.warn(message);
  };

  var error = (message) => {
    winston.error(message);
  };

  return {
    trace,
    debug,
    info,
    warn,
    error
  }
}();

  