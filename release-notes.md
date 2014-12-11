# Release Notes

## Development

[Commits](https://github.com/jhudson8/react-mixin-manager/compare/v0.9.4...master)

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
