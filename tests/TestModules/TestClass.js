/**
 * Created by rharik on 7/1/15.
 */


module.exports = function(TestClassBase, pointlessDependency, logger) {
    class TestClass extends TestClassBase {
        constructor(someOtherProp) {
            super('kid prop');
            this._someOtherProp = someOtherProp + pointlessDependency();
            this._dateTime = "kid "+ new Date().now();
            logger.debug('_someOtherProp : '+this._someOtherProp );
            logger.debug('_dateTime : '+this._dateTime );
        }

        setSomeOtherProp(val) {
            this._someOtherProp = val;
        }
    }
};