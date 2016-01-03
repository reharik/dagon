/**
 * Created by rharik on 12/2/15.
 */

var dagon = require('../../../src/containerModules/moduleRegistry');
var fs = require('fs');
var path = require('path');

module.exports = function(){
    var result;
    try {
        var dependentMod2 = fs.realpathSync('tests/TestModules/dependentModule2/dependentMod2.js');

        result = dagon(x=> x.pathToRoot(__dirname)
            .requiredModuleRegistires([dependentMod2])
            .for('ramda').renameTo('R')
            .for('ramdafantasy').renameTo('_fantasy')
            .complete());
    } catch (ex) {
        console.log(ex);
        console.log(ex.stack);
    }
    return result;
};
