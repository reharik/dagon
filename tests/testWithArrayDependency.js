/**
 * Created by parallels on 7/17/15.
 */


module.exports = function(logger, testGroup){
    return function(){
        return {deps: testGroup};
    }
};
