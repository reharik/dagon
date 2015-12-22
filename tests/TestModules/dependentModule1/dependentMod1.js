/**
 * Created by rharik on 12/2/15.
 */

var dagon = require('../../../src/containerModules/moduleRegistry');

var path = require('path');

module.exports = function(){
    var result;
    try {
        result = dagon(x=> x.pathToRoot(__dirname)
            .requiredModuleRegistires(['tests/TestModules/dependentModule2/dependentMod2.js'])
            .for('ramda').renameTo('R')
            .for('ramdafantasy').renameTo('_fantasy')
            .complete());
    } catch (ex) {
        console.log(ex);
        console.log(ex.stack);
    }
    return result;
};
