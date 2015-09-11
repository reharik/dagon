/**
 * Created by rharik on 6/30/15.
 */

var invariant = require('invariant');
var _ = require('lodash');
var logger = require('./logger');

module.exports = function(items, groupName){

    var buildGroupAsHash = function(groupName) {
        groupName = groupName.replace('_hash','');
        logger.trace('groupDependencies | buildGroupAsHash: looking for groupName: ' + groupName);
        var item = {};
        for(let i of items){
            logger.trace('groupDependencies | buildGroupAsHash: item groupName: ' + i.groupName);
            if(i.groupName === groupName){
                logger.trace('groupDependencies | buildGroupAsHash: found item in group: ' + i.name);
                item[i.name] = i;
            }
        }
        return item;
    };

    var buildGroupAsArray = function(groupName) {
        groupName = groupName.replace('_array','');
        var item = [];
        for(let i of items){
            logger.trace('groupDependencies | buildGroupAsArray: item groupName: ' + i.groupName);
            if(i.groupName === groupName){
                logger.trace('groupDependencies | buildGroupAsArray: found item in group: ' + i.name);
                item.push(i);
            }
        }
        if(item.length>0){ return item; }
    };

    invariant(items, 'groupDependencies requires graph of items to query.');
    invariant(groupName, 'groupDependencies requires an group name to try and build.');

    logger.trace('groupDependencies | constructor : looping through items');
    if(groupName.indexOf('_hash') <= 0 ){
        return buildGroupAsArray(groupName);
    }
    return buildGroupAsHash(groupName);
};
