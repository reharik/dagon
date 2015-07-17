/**
 * Created by rharik on 6/30/15.
 */

var Dependency = require('./Dependency');

module.exports = class GraphResolver{
    constructor(){
        this.graph;
    }
    recurse(_graph){
        this.graph = _graph;
        this.recurseTree(this.graph.items());

    }

    recurseTree(items) {
        return items.forEach(x=> {
            if (x.getChildren(this.graph)) {
                this.recurseTree(x.children());
            }
            x.resolveInstance(this.graph);
        });
    };

};