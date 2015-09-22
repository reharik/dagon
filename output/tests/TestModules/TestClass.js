/**
 * Created by rharik on 7/1/15.
 */


module.exports = function(TestClassBase, pointlessDependency, logger) {
    console.log(TestClassBase);
    return class TestClass extends TestClassBase {
        constructor(someOtherProp) {
            super(someOtherProp);
            this.pointlessDependencyId = pointlessDependency();
            this._someOtherProp = someOtherProp + this.pointlessDependencyId;
            this._dateTime = "kid "+ new Date();
            logger.debug('_someOtherProp : '+this._someOtherProp );
            logger.debug('_dateTime : '+this._dateTime );
        }

        setSomeOtherProp(val) {
            this._someOtherProp = val;
        }

        getSomeOtherPropVal(){
            return this._someOtherProp;
        }

        callLogger(val){
            return logger.debug(val);
        }
    }
};
