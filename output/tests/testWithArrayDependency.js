/**
 * Created by parallels on 9/10/15.
 */

module.exports = function(logger, testGroup){
    return function(){
        return {deps: testGroup};
    }
};
