/**
 * Created by reharik on 7/18/15.
 */

'use strict';

var Dependency = require('./Dependency');
var fs = require('fs');
var appRoot = require('./appRoot');

module.exports = {
    recurseDirectories: function recurseDirectories(dir) {
        var _this = this;

        return fs.readdirSync(dir).map(function (x) {
            var stat = fs.statSync(dir + '/' + x);
            if (stat && stat.isDirectory()) {
                _this.recurseDirectories(dir + '/' + x);
            }
            return x;
        }).filter(function (x) {
            return x.endsWith('.js');
        }).map(function (x) {
            return _this.processFile(x, dir);
        });
    },

    processFile: function processFile(file, dir, groupName) {
        if (!file.endsWith('.js')) {
            return;
        }
        file = file.replace('.js', '');
        var path = dir.replace(appRoot.path, '') + '/' + file;
        return new Dependency({ name: file, path: path, internal: true, groupName: groupName || '' });
    }

};