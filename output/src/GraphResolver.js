/**
 * Created by rharik on 6/30/15.
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var logger = require('./yowlWrapper');

module.exports = (function () {
    function GraphResolver() {
        _classCallCheck(this, GraphResolver);

        this.graph;
    }

    _createClass(GraphResolver, [{
        key: 'recurse',
        value: function recurse(_graph) {
            logger.trace('GraphResolver | recurse: beginning recursion');
            this.graph = _graph;
            this.recurseTree(this.graph.items());
        }
    }, {
        key: 'recurseTree',
        value: function recurseTree(items) {
            var _this = this;

            return items.forEach(function (x) {
                if (x.getChildren(_this.graph)) {
                    _this.recurseTree(x.children());
                }
                x.resolveInstance(_this.graph);
            });
        }
    }]);

    return GraphResolver;
})();