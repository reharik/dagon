'use strict';

var yowl = require('./localYowl/index');
var moment = require('moment');

module.exports = new yowl({
    system: {
        applicationName: "dagon",
        environment: "dev"
    }
});