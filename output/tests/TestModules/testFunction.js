/**
 * Created by rharik on 7/1/15.
 */

module.exports = function(pointlessDependency, logger){
    return function(){
        logger.debug('testFunction');
        return 'testFunction ' + pointlessDependency();
    }
};