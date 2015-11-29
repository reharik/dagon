/**
 * Created by rharik on 9/21/15.
 */
"use strict";

var NestedError = require('nested-error');

module.exports = function (err, message) {
    var error = new NestedError(err);
    error.message = message;
    error.detailView = errorHandler(error);
    return error;
};

var errorHandler = function errorHandler(error) {
    var message = ` ${ error.message }

     ${error.stack.split("\n")}
    `;
    if (error.innerException) {
        message +=`
        --------------- Nested Exception --------------
        ${errorHandler(error.innerException, message)}
        `
    }
    return message;
};