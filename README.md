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
- All of your modules should be wrapped in a function that takes as parameters, the names of it's dependencies.  Which is to say, for each dependency for which you would normally write "var x = require('x')" you just pass the name into the wrapper.  This goes for both external modules ( modules that you have "npm install --save"'d ) and internal modules ( modules that you have defined in your source code )
- Your dependencies will be named for the file they reside in unless otherwise noted in the bootstrapper. e.g. a module in a file named "lumpyGravy.js"  will be injected by adding the param "lumpyGravy" to the wrapper of a module.

Here is your simplest bootstrap file
```sh
var container = require('dagon');

module.exports = new container(x=>
        // Path to root is really looking for where you package.json lives. 
        // If you follow the convention and put your bootstrapper next to your
        // package.json then __dirname will suffice
        x.pathToRoot(__dirname)
        // this will require all modules found in said directory
        // and it will do so recursively
        .requireDirectoryRecursively('./src')
        // the end
        .complete());
```
And here is a bootstrap using all of the features.
```sh
var container = require('dagon');

module.exports = new container(x=>
        // Path to root is really looking for where you package.json lives. 
        // If you follow the convention and put your bootstrapper next to your
        // package.json then __dirname will suffice
        x.pathToRoot(__dirname)
        // this will require all ogf the modules found in said directory
        // and it will do so recursively
        .requireDirectoryRecursively('./src')
        // this will require all of the modules in said directory,
        // but not recursively
        .requireDirectory('./somewhereelse')
        // this will group a number of modules such that you can then
        // require the groupname and recieve an array of modules.
        groupAllInDirectory('./myImplementationOfAStrategy', 'stragegy')
        // here you can specify an alternate name for a dependency.
        // A "rename" requires a "withThis"
        .rename('bluebird').withThis('Promise')
        .rename('lodash').withThis('_')
        // here you can override either a previously declared dependency
        // ( say, through the "requireDirectory" method )
        // or just register a generically named dependecy
        // and point to it's location. Very nice for testing purposes
        // A "for" requires a "require"
        .for('genericLogger').require('./src/myPersonalLogger')
        // Here we can do some post registration configuration.
        // You must specify which dependency instantiate refers to
        // I will nned to write a section on this
        .for('someModule').instantiate(i=>i
            .asClass() // alternately .asFunc()
            // if your module is an object then you do not need to specify
            .withParameters('myConnectionString', 'someOtherSetting')
            .initializeWithMethod('init')
            .withInitParameters('heySomeOtherValue', {hey:'other values'})
        // the end
        .complete());
```

#### other convienent methods
``` 
dagon.getInstanceOf('myDependency')
``` 
returns your dependency.  Using getInstanceOf inside of your module is an anti-pattern.  Don't do it. Inject it.  Period.  However, there are times you will find getInstanceOf to be very necessary.  Testing is one case.

```
dagon.whatDoIHave(options)
```
returns json result of all your dependencies currently takes the following options 
 - showResolved = bool
    - JSON.strigifies your resolved instances
 - showWrappedInstance = bool
    - shows the wrapped instances.  eg
```
    function(dep1, dep2, dep3){
        returns function(){
        }
    }
```

#### grouping
when you use the groupAllInDirectory method in your bootstrap, you specify a group name.  When you inject this group name you get an array of all the dependencies in the specified directory.  This is very handy for implementing a strategy pattern.  In .net I used to do this by interface, but we don't really have that here in node.

// as I write this I realize that perhaps I could have the foldername be the default group name unless specified

So a contrived but nice example of strategy pattern would be https://en.wikipedia.org/wiki/Strategy_pattern a calculator

You could do ( a naive example )
```
    groupAllInDirectory('/calcStrategies', 'calcStrategies')
    modules.export = function(calcStrategies){
        return function(mathOp, val1, val2){
            calcStrategies.filter(x=> x.name == mathOp)
            .forEach(x=> return x.execute(val1, val2);
        }
    }
```
this example shows why I would like to implement a hash as well, instead of requiring the strategy to have a "name" property, you could just do 
```
    modules.export = function(calcStrategies){
        return function(mathOp, val1, val2){
            return calcStrategies[mathOp](val1,val2)
            // with error handling of course
        }
    }
```

#### scoping 
using require you can create a singleton by doing 
```
    module.export = {
        'my':value
    }
```
or 
```
    module.export = function(){
    bla bla bla
    return {}
    }()
```
What you can't do ( unless I'm wrong ) is configure said singleton.

with dagon you can do 
```
    bla bla bla
    .instantiate(x=> x.asFunc().withParameters('myLocalDBConnectionString')
```
This could then return an object and voila you have an object that is a singleton that is specific to your dev environment.

You could also do this with an internal function.
```
    bla bla bla
    .initializeWithMethod('init')
            .withInitParameters('heySomeOtherValue', {hey:'lots of other values'})
```

#### injection
When testing a module.  If you hard code the 
``` 
require('someModThatCallsOutOfProcess')
```
when it comes time to unit test your module, you are doing an integration test. Like it or not.  There is no easy way, (again, unless I'm wrong ) to sub in a mock for this require.  What you end up doing is passing around your out of process modules in your method calls.  It get's very ugly very fast. 

With dagon, you can address this in one or both of two ways.  
- you can use a testBootstrap which subs your implementations right there.
```
    .for('logger').require("/unitTests/mocks/logger")
```

or you can, in your unit test do 
```
before(function(){
        container = require('../testBootstrap');
        gesConnection = container.getInstanceOf('gesConnection');
        container.inject({name: 'gesConnection', resolvedInstance: require('mockGesConnection')});
        }
   });
```
now when your mut ( module under test ) injects 'gesConnection' expecting a nifty out of process connection, it will actually get the mock;

One caveat here is that the injection rebuilds the entire container.  This means you need to be careful to do all your injections before you get the target instances.  This is why
```
container.inject( <object> || [<object>]) 
```
accepts a dependency object or an array of dependency objects.  Once you inject a dependency, all other dependencies that might require the target dependency, no matter at what level, nned to be rebuilt.

### TODO
- more docs of course
    - use cases for each feature
- make grouping return a name:value hash instead of or perhaps as a different method than the array

### Virsion 0.0.10

##### revisions
revision 0.0.10
- minor fixes and more docs

revision 0.0.7
- fixed some strangeness

revision 0.0.5
- Cleaned up my package.json a bit for npm purposes

revision 0.0.4
- add documentation

revision 0.0.3
- added lots of logging, unfortunately you have to actually change the "yowlWrapper" code to turn it on. Tried a bunch of stuff then punted
