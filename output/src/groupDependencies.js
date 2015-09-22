/**
 * Created by rharik on 6/30/15.
 */

'use strict';

var invariant = require('invariant');
var _ = require('lodash');
var logger = require('./logger');

module.exports = function (items, groupName) {

    var buildGroupAsHash = function buildGroupAsHash(groupName) {
        groupName = groupName.replace('_hash', '');
        logger.trace('groupDependencies | buildGroupAsHash: looking for groupName: ' + groupName);
        var item = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var i = _step.value;

                logger.trace('groupDependencies | buildGroupAsHash: item groupName: ' + i.groupName);
                if (i.groupName === groupName) {
                    logger.trace('groupDependencies | buildGroupAsHash: found item in group: ' + i.name);
                    item[i.name] = i;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator['return']) {
                    _iterator['return']();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return item;
    };

    var buildGroupAsArray = function buildGroupAsArray(groupName) {
        groupName = groupName.replace('_array', '');
        var item = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var i = _step2.value;

                logger.trace('groupDependencies | buildGroupAsArray: item groupName: ' + i.groupName);
                if (i.groupName === groupName) {
                    logger.trace('groupDependencies | buildGroupAsArray: found item in group: ' + i.name);
                    item.push(i);
                }
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                    _iterator2['return']();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        if (item.length > 0) {
            return item;
        }
    };

    invariant(items, 'groupDependencies requires graph of items to query.');
    invariant(groupName, 'groupDependencies requires an group name to try and build.');

    logger.trace('groupDependencies | constructor : looping through items');
    if (groupName.indexOf('_hash') <= 0) {
        return buildGroupAsArray(groupName);
    }
    return buildGroupAsHash(groupName);
};