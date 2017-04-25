/**
 * Created by rharik on 7/13/15.
 */
"use strict";

var registry = require('./containerModules/moduleRegistry');
var container = require('./containerModules/container');
var logger = require('./logger');

module.exports = function(options){
    if(options.logging_level){
        logger
    }
    return {
        registry,
        container
    }
};
