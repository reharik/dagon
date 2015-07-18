/**
 * Created by reharik on 7/18/15.
 */

var Dependency = require('./Dependency');
var fs = require('fs');
var appRoot = require('./appRoot');

module.exports = {
    recurseDirectories(dir) {
        return fs.readdirSync(dir).map(x=> {
            var stat = fs.statSync(dir + '/' + x);
            if (stat && stat.isDirectory()) {
                this.recurseDirectories(dir + '/' + x);
            }
            return x;
        })
            .filter(x=>x.endsWith('.js'))
            .map(x => this.processFile(x, dir));
    },

    processFile(file,dir, groupName){
        if(!file.endsWith('.js')){return;}
        file = file.replace('.js','');
        var path = dir.replace(appRoot.path,'')+'/'+file;
        return new Dependency({name: file, path: path, internal: true, groupName:groupName||''});
    }

};