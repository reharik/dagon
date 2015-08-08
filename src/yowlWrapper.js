var yowl = require('./localYowl/index');
var moment = require('moment');

module.exports =  function() {
    var _yowl = new yowl({
        system: {
            applicationName: "dagon",
            environment: "dev"
        }
    });

    return _yowl;

    var level = 'silly';
    _yowl.addConsoleSink({
        level,
        colorize: true,
        formatter: function (x) {
            return '[' + x.meta.level + '] message: ' + x.meta.message + ' | ' + moment().format('h:mm:ss a');
        }
    }).info("added Console Sink");
    return _yowl;
}();
