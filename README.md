[![Build Status](https://travis-ci.org/reharik/dagon.svg?branch=functional)](https://travis-ci.org/reharik/dagon)
[![Code Climate](https://codeclimate.com/github/reharik/dagon/badges/gpa.svg)](https://codeclimate.com/github/reharik/dagon)
[![Test Coverage](https://codeclimate.com/github/reharik/dagon/badges/coverage.svg)](https://codeclimate.com/github/reharik/dagon/coverage)
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

 - You must return the inside function.  If you do not it will throw. I believe it give an error something like
    "bla bla bla you probably forgot to return your module"
 - You do NOT need to maintain all the ../../ horror.  You just pass the name of your dependency into the wrapper.
    This has proven to be worth the effort of development all on it's own.

The basic usage pattern is
- Define a registry.js file ( call it whatever you want. I call it registry.js )
- Your registry.js file should live at the same level as your package.json
- All of your modules should be in their own file and all modules should only have one export
- All of your modules should be wrapped in a function that takes as parameters, the names of it's dependencies.  Which is to say, for each dependency for which you would normally write "var x = require('x')" you just pass the name into the wrapper.  This goes for both external modules ( modules that you "npm install --save" ) and internal modules ( modules that you have defined in your source code )
- Your dependencies will be named for the file they reside in unless otherwise noted in the registry. e.g. a module in a file named "lumpyGravy.js"  will be injected by adding the param "lumpyGravy" to the wrapper of a module.

Here is your simplest registry file
```sh

var dagon = require('dagon');
module.exports = function (_options) {
    var options = _options || {};
    var container = dagon(options.dagon).container;
    var result;
    try {
        result = container(x => x.pathToRoot(__dirname)
                    .requireDirectoryRecursively('./src')
                    .complete());
    } catch (ex) {
        console.log(ex);
        console.log(ex.stack);
    }
    return result;
}
```
Explained
```sh
var dagon = require('dagon');
```
```sh
// if you have some options that you would like
// to use in the process pass them in here
module.exports = function(_options) {
```
```sh
// safety precaution for if you don't pass any options in
    var options = _options || {};
```
```sh
// pass dagon specific options into dagon and access the container
    var container = dagon(options.dagon).container;
```
```sh
// wrap the registry in a try catch so you can log your errors and see what happened
    try{
```
```sh
        // Path to root is really looking for where you package.json lives.
        // If you follow the convention and put your registry next to your
        // package.json then __dirname will suffice
        x.pathToRoot(__dirname)
```
```sh
        // this will require all modules found in said directory
        // and it will do so recursively
        .requireDirectoryRecursively('./src')
```
```sh
        // the end
        .complete());
```
And here is a registry using all of the features.
```sh
var dagon = require('dagon');
module.exports = function (_options) {
    var options = _options || {};
    var container = dagon(options.dagon).container;
    var result;
    try {
        result = container(x => x.pathToRoot(__dirname)
                    .requireDirectoryRecursively('./src')
                    .requireDirectory('./somewhereelse')
                    .groupAllInDirectory('./myImplementationOfAStrategy', 'stragegy')
                    .for('bluebird').renameTo('Promise')
                    .for('lodash').renameTo('_')
                    .for('genericLogger').require('./src/myPersonalLogger')
                    .for('genericLogger').replaceWith('./src/myPersonalLogger')
                    .for('repository').subWith(() => { 'heres my mock'})
                    .complete(),
                    i=>i.instantiate('someModule')
                        .asClass() // alternately .asFunc()
                        .withParameters('myConnectionString', 'someOtherSetting')
                        .initializeWithMethod('init')
                        .withInitParameters(options.someModuleConfigs)
                    .complete());
```
Explained
```sh
var dagon = require('dagon');
```
```sh
// if you have some options that you would like
// to use in the process pass them in here
module.exports = function(_options) {
```
```sh
// safety precaution for if you don't pass any options in
    var options = _options || {};
```
```sh
// pass dagon specific options into dagon and access the container
    var container = dagon(options.dagon).container;
```
```sh
// wrap the registry in a try catch so you can log your errors and see what happened
    try{
```
```sh
        // Path to root is really looking for where you package.json lives.
        // If you follow the convention and put your registry next to your
        // package.json then __dirname will suffice
        x.pathToRoot(__dirname)
```
```sh
        // this will require all modules found in said directory
        // and it will do so recursively
        .requireDirectoryRecursively('./src')
```
```sh
        // this will require all of the modules in said directory,
        // but not recursively
        .requireDirectory('./somewhereelse')
```
```sh
        // this will group a number of modules such that you can then
        // require the groupname and recieve an array of modules.
        // the groupname is optional and will default to the directory
        // name specified
        .groupAllInDirectory('./myImplementationOfAStrategy', 'stragegy')
```
```sh
        // here you can specify an alternate name for a dependency.
        // A "renameTo" requires a "for"
        .for('bluebird').renameTo('Promise')
        .for('lodash').renameTo('_')
```
```sh
        // here you can override either a previously declared dependency
        // ( say, through the "requireDirectory" method )
        // or just register a generically named dependecy
        // and point to it's location. Very nice for testing purposes
        // A "require" requires a "for"
        .for('genericLogger').require('./src/myPersonalLogger')
```
```sh
        // here you can override either a previously declared dependency
        // ( say, through the "requireDirectory" method )
        // and point it to a previously registered dependency.
        // useful if you have something like 'logger', 'myLogger' and 'lager'
        // and want to have them all point to just one implementation
        // A "replaceWith" requires a "for"
        .for('genericLogger').replaceWith('./src/myPersonalLogger')
```
```sh
        // here you can override either a previously declared dependency
        // ( say, through the "requireDirectory" method )
        // and point it to an inline function that you declare.
        // useful for testing if you would like to pass in a mock instance 
        // but you are using a framework like sinon or testDouble
        // A "subWith" requires a "for"
        .for('repository').subWith(td.object(repository))
```
```sh
        // here you end your registration of dependencies and, optionally, begin 
        // configuring some of these dependencies to be instantiated
        .complete(),
```
```sh
        // Here we can do some post registration configuration.
        // You must specify which dependency instantiate refers to
        // using the "instantiate" method
            i=>i.instantiate('someModule').asClass() // alternately .asFunc()
```
```sh
            // if your module is an object then you do not need to specify
            .withParameters('myConnectionString', 'someOtherSetting')
            .initializeWithMethod('init')
```
```sh
            // here is an example of where you would use non-dagon specific options
            .withInitParameters(options.someModuleConfigs)
```
```sh
        // the end
        .complete());
```
#### For Testing

Here is perhaps where the greatest value of dependency injection lies.
You can have a registry that registers all of your production or integration dependencies.
In your index.js or whatever you would have:
```sh
module.exports = function(options) {
    var container = require('./registry')(options);
    var dispatcher = container.getInstanceOf('eventdispatcher');
    dispatcher.startDispatching(options.eventdispatcher)
};

// you could also have the registry call startDispatching
// and pass in the options.eventdispatcher something like this:
    .for('eventdispatcher')
        .instantiate(i=>i.asFunc()
            .initializeWithMethod('startDispatching')
            .withInitParameters(options.eventdispatcher || {}))

```

AND THEN a test_registry which registers a whole bunch of mocks.
Or even configures your regular dependencies differently ( although I'm not sure I like that idea ).  Then in your test
you would have:
```sh
 var container = require('../../registry_test')(options);
    before(function() {
        var SUT = container.getInstanceOf('eventdispatcher');
        SUT.startDispatching(options.eventdispatcher)
```
So now your eventdispatcher has a reference to a mock eventstore and a mock readstore.  Your tests are proper
unit tests and you haven't changed a line of code.

You would still use the main registry file for integration tests
but instead of passing in config options with the production connection strings you would have your integration environment
connection strings, etc.


#### Other convienent methods
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
when you use the groupAllInDirectory method in your registry, you specify a group name.  When you inject this group name you get an array of all the dependencies in the specified directory.  This is very handy for implementing a strategy pattern.  In .net I used to do this by interface, but we don't really have that here in node.

So a contrived but nice example of strategy pattern would be https://en.wikipedia.org/wiki/Strategy_pattern a calculator

You could do ( a naive example )
```
    groupAllInDirectory('/calcStrategies', 'optionalGroupName')
    modules.export = function(calcStrategies){
        return function(mathOp, val1, val2){
            calcStrategies.filter(x=> x.name == mathOp)
            .forEach(x=> return x.execute(val1, val2);
        }
    }
```
The groupAllInDirectory takes a path and an optional group name.  If no group name is provided, then the directory name will be used.

Now you can also do this
```
    modules.export = function(calcStrategies_hash){
        return function(mathOp, val1, val2){
            return calcStrategies_hash[mathOp](val1,val2)
            // with error handling of course
        }
    }
```
Notice of course the _hash suffix. This is how the container knows to inject a hash rather than an array.
If there is no suffix or there is a _array suffix then you will get an array.

You should not use the _suffix in the 'optionalGroupName' parameter of the "groupAllInDirectory" function.

#### scoping
Using require you can create a singleton by doing
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
    x => x.instantiate('database').asFunc().withParameters('myLocalDBConnectionString')
```
This could then return an object and voila you have an object that is a singleton that is specific to your dev environment.

You could also do this with an internal function.
```
    bla bla bla
    .initializeWithMethod('init')
            .withInitParameters('heySomeOtherValue', {hey:'lots of other values'})
```
### TODO
- any help/suggestions on how to make this readme better would be greatly appreciated
- more docs of course
    - use cases for each feature
- add option for reading the devdependencies from package.json so I don't have to include dev dependencies in the regular dependencies just so I can inject them
- work with code climate to get test coverage badge and code quality badge
- explain dagon loggin
- create example app

### Version 0.2.1

##### revisions
revision 1.2.0
- removed a lot of cruft, and a bunch of unused dependencies
- upgraded what dependencies were left to latest version
revision 1.1.0
- added subWith functionality for testing
revision 1.0.0
- cleaned up and made ready for production
revision 0.2.1
- fixed goddamn typeo
- removed console.log
revision 0.2.0
- Not really breaking changes but I did add error handling which might change the errors you expect in your tests
- refactorted all or most of the code to be much more explicit about what it's doing and also be explicit about if it's modifying a reference or returning new value
- added error handling which will hopefully provide better diagnostic information.  This I think will be a work in progress
- added and/or fixed a bunch of tests.
- updated readme file
- incorporated travisci
revision 0.1.3
- made module accept config settings for logging
revision 0.1.2
- fixed a bug where overridding a dependency with a local module ( say a mock ) does not work
revision 0.1.1
- couple quick bug fixes
revision 0.1.0
- added some jsdoc that got eaten by babel. oh well
- BREAKING CHANGE TO RENAME
- refactored some of the explicit declaration stuff. very sorry. Now you have one "for" for each declaration including rename but you can chain them all together

revision 0.0.12
- added getArrayOfGroup method
- added getHashOfGroup method
- added ability to inject has using the groupname_hash suffix

revision 0.0.11
- minor fixes and more docs

revision 0.0.7
- fixed some strangeness

revision 0.0.5
- Cleaned up my package.json a bit for npm purposes

revision 0.0.4
- add documentation

revision 0.0.3
- added lots of logging, unfortunately you have to actually change the "yowlWrapper" code to turn it on. Tried a bunch of stuff then punted
