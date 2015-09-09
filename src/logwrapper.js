var yowl = require('./logger/index');
var moment = require('moment');

module.exports =  new yowl({
        system: {
            applicationName: "dagon",
            environment    : "dev"
        }
    });
