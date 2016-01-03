/**
 * Created by rharik on 12/18/15.
 */


var demand = require('must');
var path = require('path');
var moment = require('moment');

describe('RESOLVE ITEM', function() {
    var Mut;

    before(function() {
        Mut        = require('../../src/graphResolution/resolveItem');
    });

    describe('#RESOLVEITEM', function() {
        context('when calling resolveItem with no item provided', function () {
            it('should throw proper error', function () {
                var error = '';
                try{
                    Mut()
                }catch(ex){
                    error = ex.message;
                }
                error.must.contain('Item to resolve must be provided.');
            })
        });
    });

    context('when calling resolveItem with item provided that has no deps', function () {
        it('should return instanciated instance', function () {
            var item = {
                name: 'item1',
                wrappedInstance: function(){return function(){return '';}}
            };
            Mut([],item).must.be.function();
        })
    });

    context('when calling resolveItem with item provided that does have deps', function () {
        it('should return instanciated instance', function () {
            var item = {
                name: 'item1',
                wrappedInstance: function(item2){return function(){return '';}}
            };

            var item2 = {
                name: 'item2',
                wrappedInstance: function(){return function(){return '';}},
                resolvedInstance: function(){return '';}
            };
            Mut([item2],item).must.be.function();
        })
    });

    context('when calling resolveItem with item provided that does have deps, but that are not in list', function () {
        it('should throw proper error', function () {
            var item = {
                name: 'item1',
                wrappedInstance: function(item2){return function(){return '';}}
            };

            var item2 = {
                name: 'item2',
                wrappedInstance: function(){return function(){return '';}},
                resolvedInstance: function(){return '';}
            };
                var error = '';
            try{
                Mut([],item)
            }catch(ex){
                error = ex.message;
            }
            error.must.equal('unable to find dependency: item2 for item: item1');
        })
    });
});
