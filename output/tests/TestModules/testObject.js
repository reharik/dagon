/**
 * Created by rharik on 7/1/15.
 */

module.exports = function(pointlessDependency, testFunction){
    return {
        firstProp: 'firstProp',
        secondPropShouldbeUnique: pointlessDependency(),
        thirdPropAlsoUnique: testFunction()
    };
};