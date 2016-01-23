"use strict";


var logger = require('./logger_module/index');
var moment = require('moment');

module.exports =  new logger({
        system: {
            applicationName: "dagon",
            environment    : "dev"
        }
    });
