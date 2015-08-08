/**
 * Created by rharik on 7/1/15.
 */

module.exports = function(testFunction, logger){
    return function(){
        var childRef = testFunction() + " SIM!";
        logger.debug(chidRef);
        return {
            publicChildRef: "public! " + childRef
        }
    }
};