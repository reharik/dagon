/**
 * Created by rharik on 12/13/15.
 */
"use strict";

var logger = require('./../logger');

module.exports = function groupDependencies(resDeps, name) {
    var groupedItems = resDeps.filter(x=> x.groupName === name);
    var groupType    = name.indexOf('_array') > -1 ? 'array' : 'hash';
    var group        = groupType === 'array'
        ? buildGroupAsArray(groupedItems)
        : buildGroupAsHash(groupedItems);

    resDeps.push({name  : name,
        resolvedInstance: group,
        type            : groupType
    });
};

var buildGroupAsHash = function(groupedItems) {
    var item = {};
    for (let i of groupedItems) {
        item[i.name] = i.resolvedInstance;
    }
    return item;
};

var buildGroupAsArray = function(groupedItems) {
    var item = [];
    for (let i of groupedItems) {
        item.push(i.resolvedInstance);
    }
    if (item.length > 0) {
        return item;
    }
};
