/**
 * Created by rharik on 6/30/15.
 */

var logger = require('./yowlWrapper');

module.exports = class GraphResolver{
    constructor(){
        this.graph;
    }
    recurse(_graph){
        logger.trace('GraphResolver | recurse: beginning recursion');
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
