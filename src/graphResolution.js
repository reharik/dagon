/**
 * Created by rharik on 6/30/15.
 */

var Dependency = require('./Dependency');

module.exports = class graphResolution{
    constructor(_graph){
        this.graph = _graph;
        this.recurseTree(this.graph);
    }
    recurseTree(items) {
        return items.forEach(x=> {
            if (x.getChildren(this.graph)) {
                recurseTree(x.children);
            }
            x.resolveInstance(this.graph);
        });
    };
};