/**
 * Created by rharik on 6/23/15.
 */
var bootstrapper = require('./src/IOC/bootstrapper');

module.exports = function(){
    var container = container ? container
        : bootstrapper.initialize(x=>
            x.pathToJsonConfig('./package.json')
                .replace('lodash').withThis('_')
                .replace('bluebird').withThis('Promise')
                .complete());
    return container;
}();
