/**
 * Created by rharik on 7/1/15.
 */

module.exports = function(logger) {

    return class TestClassBase {
        constructor(someProp) {
            this._someProp = someProp;
            this._baseDateTime = "base " + new Date().now;
            logger.debug('someProp: '+this._someProp);
            logger.debug('_baseDateTime: '+this._baseDateTime );
        };

        setSomeProp(val) {
            this._someprop = val;
        };
    }
};
