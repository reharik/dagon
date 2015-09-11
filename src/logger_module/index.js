var Winston = require("winston"),
    Joi = require("joi"),
    _ = require("lodash"),
    Moment = require("moment"),
    OS = require("os"),
    Enum = require("./modules/enum.js");

require("winston-logstash");

var loggerBase = function(options){
    var internals = {
        options : {
            system : {
                environment : "",
                applicationName : "",
                host : OS.hostname(),
                pid : process.pid
            },
            console : {
                level : "info",
                colorize : true
            },
            dailyRotateFile : {
                level : "info",
                filename : "/tmp/yowl.log"
            },
            logstash : {
                port : 28777,
                node_name : OS.hostname(),
                host: "127.0.0.1"
            },
            sqslogstash : {
                aws : {
                    region : "us-east-1"
                },
                sqs : {}
            },
            test : {
                messages : []
            }
        },
        context : {
            logger : new(Winston.Logger)({
                exitOnError : false
            })
        },
        schema : {
            system : Joi.object().keys({
                environment : Joi.string().valid(Enum.environments()).required(),
                applicationName : Joi.string().required(),
                host : Joi.string().token()
            }).required(),
            console : Joi.object().keys({
                level : Joi.string().valid(Enum.logLevels()),
                colorize : Joi.boolean()
            }),
            dailyRotateFile : Joi.object().keys({
                level : Joi.string().valid(Enum.logLevels()),
                filename : Joi.string()
            }),
            logstash : Joi.object().keys({
                port : Joi.number().integer(),
                node_name : Joi.string(),
                host: Joi.string()
            })
        }
    };

    validate(internals.schema.system, options.system);
    internals.options.system = _.assign(internals.options.system, options.system);

    function addConsoleSink(options){
        validate(internals.schema.console, options);
        internals.options.console = _.assign(internals.options.console, options);
        internals.context.logger.add(Winston.transports.Console, internals.options.console);
        return this;
    }

    function addDailyRotateFileSink(options){
        validate(internals.schema.dailyRotateFile, options);
        internals.options.dailyRotateFile = _.assign(internals.options.dailyRotateFile, options);
        internals.context.logger.add(Winston.transports.DailyRotateFile, internals.options.dailyRotateFile);
        return this;
    }

    function addLogstashSink(options){
        validate(internals.schema.logstash, options);
        internals.options.logstash = _.assign(internals.options.logstash, options);
        internals.context.logger.add(Winston.transports.Logstash, internals.options.logstash);
        return this;
    }

    function clearTestSink(){
        internals.options.test.messages = [];
    }

    function validate(schema, option){
        Joi.validate(option, schema, { allowUnknown : true }, function(err){
            if(err)
                throw err;
        });
    }

    function error(context){
        internals.context.logger.error(mapContext(context, "error"));
        return this;
    }

    function warn(context){
        internals.context.logger.warn(mapContext(context, "warn"));
        return this;
    }

    function info(context){
        internals.context.logger.info(mapContext(context, "info"));
        return this;
    }

    function debug(context){
        internals.context.logger.debug(mapContext(context, "debug"));
        return this;
    }

    function trace(context){
        internals.context.logger.silly(mapContext(context, "trace"));
        return this;
    }

    function mapContext(context, level){
        if(context == null)
            return;

        var message = createEmptyMessage(level);

        if(context instanceof Error)
            mapError(context, message);
        else if(context.error instanceof Error)
            mapError(context.error, message);
        else if (isString(context))
            message.message = context;
        else{
            mapObject(context, message);
        }

        return message;
    }

    function mapObject(context, message){
        for(var key in context){
            if(key != "message" && key != "tags" && key != "status"){
                if(isNumeric(context[key]))
                    message.nprops[key] = context[key];
                else if(isString(context[key]))
                    message.sprops[key] = context[key];
            }
            else if(key == "status" && isObject(context[key]))
                message.status = context[key];
            else if(key == "message" && isString(context[key]))
                message.message = context[key];
            else if(key == "tags" && isArray(context[key]))
            {
                for(var i in context[key]){
                    if(isString(context[key][i]))
                        message.tags.push(context[key][i]);
                }
            }
        }
    }

    function mapError(err, message) {
        message.message = err.message;
        message.stackTrace = err.stack;

        mapObject(err, message);
    }

    function createEmptyMessage(level){
        return {
            system : {
                environment: internals.options.system.environment,
                applicationName: internals.options.system.applicationName,
                host: internals.options.system.host,
                pid : internals.options.system.pid
            },
            sprops : {},
            nprops : {},
            tags : [],
            level : level,
            message : "",
            type : "yowl",
            "@timestamp" : Moment().toISOString()
        };
    }

    function isNumeric(value){
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    function isString(value){
        return typeof value == "string" || value instanceof String;
    }

    function isObject(value){
        return typeof value == "object" && value != null;
    }

    function isArray(value){
        return _.isArray(value);
    }

    return {
        getContext : function(){return internals.context;},
        // this is for testing purposes and is just as ugly as it looks
        exposeInternals: function(){return internals;},
        addConsoleSink : addConsoleSink,
        addDailyRotateFileSink : addDailyRotateFileSink,
        addLogstashSink : addLogstashSink,
        error : error,
        warn : warn,
        info : info,
        debug : debug,
        trace : trace,
        mapContext : mapContext
    }
};

module.exports = loggerBase;
module.exports.levels = Enum.logLevels();
module.exports.environments = Enum.environments();
