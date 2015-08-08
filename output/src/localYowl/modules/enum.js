"use strict";

module.exports = {
    logLevels: function logLevels() {
        return ["debug", "info", "warn", "error", "silly"];
    },
    environments: function environments() {
        return ["dev", "prod", "qa", "test"];
    },
    awsRegions: function awsRegions() {
        return ["ap-northeast-1", "ap-southeast-1", "ap-southeast-2", "cn-north-1", "eu-central-1", "eu-west-1", "eu-central-1", "us-gov-west-1", "sa-east-1", "sa-east-1", "us-east-1", "us-west-1", "us-west-2"];
    }
};