/**
 * Created by rharik on 7/1/15.
 */


module.exports = function(uuid){
    return function(){
        return "do nothing" + uuid.v1();
    }
};