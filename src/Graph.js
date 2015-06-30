/**
 * Created by rharik on 6/30/15.
 */

var invariant = require('invariant');

module.exports = class Graph{
    constructor(){
        this.items = []
    }

    findRequiredDependency(caller, dependency){
        for(let i of this.items){
            if(i.name === dependency){
                return i;
            }
            invariant(true, 'Module '+caller+' has a dependency that can not be resolved: '+dependency);
        }
    }

    findDependency(type){
        for(let i of this.items){
            if(i.name === type){
                return i.resolvedInstance;
            }
       }
    }

    mapItems(func){
        return items.map(func);
    }

    buildGraph(pjson){
        Object.keys(pjson.dependencies).forEach(x=> {
            items.push(new Dependency(x.replace('-', '', x)));
        });
        Object.keys(pjson.internalDependencies).forEach(x=> {
            items.push( new Dependency(x, path.join(appRoot + pjson.internalDependencies[x])));
        });
    }

};
