/**
 * Created by rharik on 9/21/15.
 */
"use strict";

var NestedError = require('nested-error');

module.exports = function (err, message) {
    var error = new NestedError(err);
    error.message = message;
    error.detailView = errorHandler(error,[]);
    return error;
};

var errorHandler = function errorHandler(error, result) {
    var stackArray = error.stack.split("\n");

    result.push(stackArray);
    if (error.innerException) {
        result.push('--------------- Nested Exception --------------');
        errorHandler(error.innerException, result);
    }
    return result;
};