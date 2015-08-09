# dagon
dagon is a dependency injection container.
It is loosely based on structuremap, the predominant IOC container for C#
This container is fairly unobtrusive.
Instead of writing the following

```sh
var a = require('a');
var b = require('../b');
var c = require('../../c');

module.exports = function(){
    return a.doSomething() + b.doSomething() + c.doSomething();
}
```
you would write
```sh
module.exports = function(a, b, c){
    return function(){
        return a.doSomething() + b.doSomething() + c.doSomething();
    }
}
```
Two things to note, are that

 - You must return the inside function.  If you do not it will throw, but I believe it give an error something like
    "bla bla bla you probably for got to return your module"
 - You do NOT need to maintain all the ../../ horror.  You just pass the name of your dependency into the wrapper.
    This has proven to be worth the effort of development all on it's own.

The basic usage pattern is 
- Define a bootstrap.js file ( call it whatever you want. I call it bootstrap.js ) 
- Your bootstrap.js file should live at the same level as your package.json
- All of your modules should be in thier own file and all modules should only have one export
- All of your modules should be wrapped in a function that takes as parameters, the names of it's dependencies.  Which is to say, for each dependency for which you would normally write "var x = require('x')" you just pass into the name into the wrapper.  This goes for both external modules ( modules that you have "npm install --save"'d ) and internal modules ( modules that you have defined in your source code )
- Your dependencies will be named for the file they reside in unless otherwise noted in the bootstrapper. e.g. a module in a file named "lumpyGravy.js"  will be injected by adding the param "lumpyGravy" to the wrapper of a module.

Here is your simplest bootstrap file
```sh
var container = require('dagon');

module.exports = new container(x=>
        // Path to root is really looking for where you package.json lives. 
        // If you follow the convention and put your bootstrapper next to your package.json
        // then __dirname will suffice
        x.pathToRoot(__dirname)
        // this will require all modules found in said directory and it will do so recursively
        .requireDirectoryRecursively('./src')
        // the end
        .complete());
```
And here is a bootstrap using all of the features.
```sh
var container = require('dagon');

module.exports = new container(x=>
        // Path to root is really looking for where you package.json lives. 
        // If you follow the convention and put your bootstrapper next to your package.json
        // then __dirname will suffice
        x.pathToRoot(__dirname)
        // this will require all ogf the modules found in said directory and it will do so recursively
        .requireDirectoryRecursively('./src')
        // this will require all of the modules in said directory, but not recursively
        .requireDirectory('./somewhereelse')
        // this will group a number of modules such that you can then require the groupname 
        // and recieve an array of modules.  More on this later ( I hope )
        groupAllInDirectory('./myImplementationOfAStrategy', 'stragegy')
        // here you can specify an alternate name for a dependency.  A "rename" requires a "withThis"
        .rename('bluebird').withThis('Promise')
        .rename('lodash').withThis('_')
        // here you can override either a previously declared dependency ( say, through the "requireDirectory" method )
        // or just register a generically named dependecy and point to it's location.l  Very nice for testing purposes
        // A "for" requires a "require"
        .for('genericLogger').require('./src/myPersonalLogger')
        // Here we can do some post registration configuration.  You must specify which dependency instantiate refers to
        // I will nned to write a section on this
        .for('someModule').instantiate(i=>i
            .asClass() // alternately .asFunc() // if your module is an object then you do not need to specify
            .withParameters('myConnectionString', 'someOtherSetting')
            .initializeWithMethod('init')
            .withInitParameters('heySomeOtherValue', {hey:'lots of other values'})
        // the end
        .complete());
```

### TODO
- more docs of course
    - use cases for each feature
    - further explanation of grouping
    - further explanation of instantiate
    - exploration of module scope
    - show module injection
- make grouping return a name:value hash instead of or perhaps as a different method than the array

### Virsion 0.0.5

##### revisions
revision 0.0.5
- Cleaned up my package.json a bit for npm purposes

revision 0.0.4
- add documentation

revision 0.0.3
- added lots of logging, unfortunately you have to actually change the "yowlWrapper" code to turn it on. Tried a bunch of stuff then punted
