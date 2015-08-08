'use strict';

module.exports = function () {
    return {
        trace: function trace(x) {
            console.log('Trace: ' + x);
        },
        debug: function debug(x) {
            console.log('Debug: ' + x);
        },
        info: function info(x) {
            console.log('Info: ' + x);
        },
        warn: function warn(x) {
            console.log('Warn: ' + x);
        },
        error: function error(x) {
            console.log('Error: ' + x);
        }
    };
};