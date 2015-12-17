/**
 * Created by rharik on 12/13/15.
 */

var logger = require('./../logger');
var fnArgs = require('fnargs');

var handleUnListedItems = require('./handleUnListedItems');
var resolveItem = require('./resolveItem');

module.exports = function resolveInstance(item, unResDeps, resDeps){
    if(resDeps.indexOf(x=>x.name === item.name)>0){
        return
    }

    fnArgs(item.wrappedInstance).forEach(a=>{
        var nextItem = unResDeps.find(x=>x.name == a);
        if(!nextItem) {
            handleUnListedItems(unResDeps, resDeps);
        } else {
            resolveInstance(nextItem, unResDeps, resDeps);
        }
    });

    item.resolvedInstance = resolveItem(item, resDeps);
    resDeps.push(item);
};
