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

  var logger = new winston.Logger({
    transports,
    level: process.env.DAGON_LOGGING_LEVEL || 'error'
  });
  var trace = (message) => {
    logger.silly(message);
  };

  var debug = (message) => {
    logger.debug(message);
  };

  var info = (message) => {
    logger.info(message);
  };

  var warn = (message) => {
    logger.warn(message);
  };

  var error = (message) => {
    logger.error(message);
  };

  return {
    trace,
    debug,
    info,
    warn,
    error
  }
}();

