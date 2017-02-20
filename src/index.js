/**
 * Created by rharik on 7/13/15.
 */
"use strict";

var registry = require('./containerModules/moduleRegistry');
var container = require('./containerModules/container');

module.exports = function(){
    return {
        registry,
        container
    }
};
