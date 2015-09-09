/**
 * Created by rharik on 6/30/15.
 */

var invariant = require('invariant');
var _ = require('lodash');
var logger = require('./logger');

module.exports = function(items, groupName){

    var buildGroupAsHash = function(groupName) {
        groupName = groupName.replace('_hash','');
        var item = {};
        for(let i of items){
            logger.trace('Graph | findGroupedDependencies: looking for groupName: ' + groupName);
            logger.trace('Graph | findGroupedDependencies: item groupName: ' + i.groupName);
            if(i.groupName === groupName){
                logger.trace('Graph | findGroupedDependencies: found item in group: ' + i.name);
                item[i.name] = i;
            }
        }
        return item;
    };

    var buildGroupAsArray = function(groupName) {
        groupName = groupName.replace('_array','');
        var item = [];
        for(let i of items){
            logger.trace('Graph | findGroupedDependencies: looking for groupName: ' + groupName);
            logger.trace('Graph | findGroupedDependencies: item groupName: ' + i.groupName);
            if(i.groupName === groupName){
                logger.trace('Graph | findGroupedDependencies: found item in group: ' + i.name);
                item.push(i);
            }
        }
        if(item.length>0){ return item; }
    };

    logger.trace('Graph | findGroupedDependencies: looping through items');
    if(groupName.indexOf('_hash') <= 0 ){
        return buildGroupAsArray(groupName);
    }
    return buildGroupAsHash(groupName);
};
