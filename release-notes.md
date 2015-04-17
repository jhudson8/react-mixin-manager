# Release Notes

## Development

[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v1.0.0...master)

## v1.0.0 - April 17th, 2015
There are no longer initialization requirements for the mixin manager.  React.mixins no longer exists - it is not the return value from the ```react-mixin-manager``` require.

The required changes to your app are as follows:

* the initialization code is now just ```require('react-mixin-manager');'''
* All code referencing ```React.mixins.whatever``` must now change to ```ReactMixinManager.whatever``` (assuming ReactMixinManager = ```require('react-mixin-manager')```)



[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.13.1...v1.0.0)

## v0.13.1 - March 23rd, 2015
- always return boolean value from shouldComponentUpdate - b8a62a9


[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.13.0...v0.13.1)

## v0.13.0 - February 15th, 2015
- add method will now always replace a previous mixin with the same alias & removed the replace function - 7c005c0

In order to have deterministic behavior with mixins that are added w/o namespaces and un-qualified references to mixins registered with a namespace there is no longer a ```React.mixins.replace``` and ```React.mixins.add``` will *always* replace a mixin if it currently exists with the same alias.

If you only want to add a mixin if it does not previously exist, you can use

```
    if (!React.mixins.exists('mixinName')) {
      React.mixins.add('mixinName', ...);
    }
```

Also, getting close to a 1.0 release


[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.12.0...v0.13.0)

## v0.12.0 - February 12th, 2015
- add namespace support - a03f201

If the name contains a dot "." the prefix is assumed to be the namespace.  A mixin can be retrieved by either using the fully qualified name or the suffix.  The first mixin to be added with any suffix will be returned if there are 2 different namespaces with the same suffix.

```
    React.mixins.add('namespace-a.foo', aFoo);
    React.mixins.add('namespace-b.foo', bFoo);
    mixins: ['foo'] // will result to [aFoo]
    mixins: ['namespace-a.foo'] // will result to [aFoo]
    mixins: ['namespace-b.foo'] // will result to [bFoo]
```


[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.11.2...v0.12.0)

## v0.11.2 - February 9th, 2015
- fix bug when named mixins were using the mixins attribute to define dependencies - f2dea59


[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.11.1...v0.11.2)

## v0.11.1 - February 5th, 2015
- fix token comment in un-minified source (for react-backbone) - df41ae9
(no functional change)


[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.11.0...v0.11.1)

## v0.11.0 - February 5th, 2015
- add customizable deferUpdate timer - 9b28b4e

```React.mixins.defaultDeferUpdateInterval``` can be used to set the interval in milis between the ```deferUpdate``` call and the actual ```forceUpdate``` call.  A value < 0 will not defer the ```forceUdpate``` call (beneficial only to change behavior of 3rd party mixins that depend on this functionality).

The defer interval can also be adjusted on a per component basis.  Any mixins registered as dependencies of the React component will obey the value that is set for the component.  It can be set using the mixin parameter.

```
React.createClass({
  // call forceUpdate 100 ms after the deferUpdate call
  mixin: ['deferUpdate(100)'],

  somethingThatRequiresUpdate: function() {
    this.deferUpdate();
  }
});
```


[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.10.0...v0.11.0)

## v0.10.0 - December 29th, 2014
- initiatedOnce mixins should accept array or argument arrays - dc3cdc4

Compatibility notes:
If you are using the advanced "initiatedOnce" capabilities, the argument structure has changed.

Previously, there would be a function argument representing each parameterized mixin reference and now there is a single argument which is an array of argument arrays.  The length of this array would be equal to the number of times the mixin was referenced with parameters.

For example:
```
    mixins: ['foo("a")', 'foo("b", "c")']
```
Would previously execute the mixin wrapper function as
```
    function(["a"], ["b", "c"])
```
But will now use
```
    function([["a"], ["b", "c"]])
```

[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.9.4...v0.10.0)

## v0.9.4 - December 11th, 2014
- code cleanup and remove accidental global var 5f4674f


[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.9.3...v0.9.4)

## v0.9.3 - December 10th, 2014
no functional code changes.  There is just an additional comment that is used to create react-backbone/with-deps.js


[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.9.2...v0.9.3)

## v0.9.2 - December 1st, 2014
- allow object mixin references to have a "mixins" attribute to define dependencies - e6a1edd


[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.9.1...v0.9.2)

## v0.9.1 - November 26th, 2014
- for AMD, you must execute the function with params (see README AMD install instructions) - 37c72bb
```
require(
  ['react', react-mixin-manager'], function(React, reactMixinManager) {
  reactMixinManager(React); 
});
```


[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.9.0...v0.9.1)

## v0.9.0 - November 25th, 2014
- add React.mixins.getState / React.mixins.setState methods - 42443d2


[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.8.0...v0.9.0)

## v0.8.0 - November 11th, 2014
- add "state" mixin - 4c00d185

[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.7.1...v0.7.2)

## v0.7.1 - September 7th, 2014
- add react-component keyword - bcdeeb9

[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.7.0...v0.7.1)

## v0.7.0 - August 8th, 2014
- [#1](https://github.com/jhudson8/react-mixin-manager/pull/1) - Once initiated mixins support. ([@anatolikurtsevich](https://api.github.com/users/anatolikurtsevich))

[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.6.1...v0.7.0)

## v0.6.1 - July 19th, 2014
- bug fix: include dependencies when mixin parameters are used - ec68956

[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.6.0...v0.6.1)

## v0.6.0 - July 19th, 2014
- add React component provided mixin parameters - e574075

[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.5.2...v0.6.0)

## v0.5.2 - June 16th, 2014
- allow add/replace signature (name, array) where array is [mixin, dependencies...] - 798c6a2
- add bower.json - ea204e6

[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.5.1...v0.5.2)

## v0.5.1 - June 14th, 2014
- remove console.log - 3e2bc8a
- Update README.md - 286555c

[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.5.0...v0.5.1)

## v0.5.0 - June 14th, 2014
- added the "deferUpdate" mixin - 4e74d21

[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.4.0...v0.5.0)

## v0.4.0 - May 18th, 2014
- add new "inject" functionality - 7fc5324

[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.3.0...v0.4.0)

## v0.3.0 - May 16th, 2014
- change "group" function name to "alias" - 21e6242
- fix author email address - 85358eb

[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.2.0...v0.3.0)

## v0.2.0 - May 15th, 2014
- add mixing group registration API - f53d869
- allow mixins to be functions for later execution - e81cfb3

[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.1.2...v0.2.0)

## v0.1.2 - May 10th, 2014
- require React to be passed as param for commonJS init - 887f7d8

[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.1.1...v0.1.2)

## v0.1.1 - May 10th, 2014
- add index.js

[Commits](https://github.com/jhudson8/react-mixin-manager/compare/ee47aec...v0.1.1)
