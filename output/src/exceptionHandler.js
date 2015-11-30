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
    var ex = {
        message:error.message,
        stack:error.stack.split("\n")
    };
    result.push(JSON.stringify(ex));
    if (error.innerException) {
        result.push({message: '--------------- Nested Exception --------------'});
        errorHandler(error.innerException, result);
    }
    return result;
};