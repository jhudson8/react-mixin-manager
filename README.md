react-mixin-manager
========================
Give your components advanced mixin capabilities including mixin grouping and aliasing with dependency management.

***Problem:*** React mixins get cumbersome because, if they are done right, they should be as granular as possible.  This is can be difficult sometimes because ***a)*** mixins can not duplicate attribute names and ***b)*** mixins must assume that all required functionality is available (creating DRY issues with multiple mixins using the same basic functionality).

***Solution:*** Provide a manager that allows registering mixins by an alias and allowing dependencies to be specified on that mixin.  By allowing mixins to be included by alias, we can determine all dependencies and ensure that they are included (and not duplicated) as well.

1. React mixins can be much more granular (because they are reused)
2. Reduce a lot of DRY code when it comes to mixins because they can depend on existing functionality
3. Less chance of mixin duplicate function name collision (because they are more granular and reused)
4. 3rd party mixins can expose internal behaviors as registered mixins to be overridden by consumers


Installation
------------
* Browser: include *react-mixin-manager[.min].js* after [React](http://facebook.github.io/react/)
* CommonJS: ```require('react-mixin-manager')(require('react'));```

API
------------

### React.mixins

#### add(mixinName, mixin[, dependsOn, dependsOn, ...])
* ***mixinName***: (string) the alias to be used when including the mixin for a React component
* ***mixin***: the mixin object
* ***dependsOn***: (string or array) the alias of another mixin that must be included if this mixin is included

Register the mixin to be referenced as the alias `mixinName` with any additional dependencies (by alias) as additional arguments.  This *will not* replace an existing mixin by that alias.

*Standard mixin*
```
// register myMixinImpl as the alias "myMixin"
React.mixins.add('myMixin', myMixinImpl);
...
React.createClass({
  mixins: ['myMixin', anyOtherPlainOldMixin]
})
// myMixinImpl, anyOtherPlainOldMixin will be included
```

*Mixin with dependencies*
```
// register mixin1Impl as the alias "mixin1"
React.mixins.add('mixin1', mixin1Impl);
// register mixin2Impl as the alias "mixin2" with a dependency on the mixin defined by the alias "mixin1"
React.mixins.add('mixin2', mixin2Impl, 'mixin1');
...
React.createClass({
  mixins: ['mixin2', anyOtherPlainOldMixin]
})
// mixin1Impl, mixin2Impl, anyOtherPlainOldMixin will be included (a named mixin will never be included multiple times)
```
***note***: if the registered mixin is a function, it will be executed and the return value will be used as the mixin


#### replace(mixinName, mixin[, dependsOn, dependsOn, ...])
* ***mixinName***: (string) the alias to be used when including the mixin for a React component
* ***mixin***: the mixin object
* ***dependsOn***: (string or array) the alias of another mixin that must be included if this mixin is included

Same as ```React.mixins.add``` but it *will replace* an existing mixin with the same alias.


#### inject(mixinName, dependsOn[, dependsOn, ...])
* ***mixinName***: (string) the alias to be used when including the mixin for a React component
* ***dependsOn***: (string or array) the alias of another mixin that must be included if this mixin is included

Add additional dependencies to a mixin that has already been registered.


#### alias(mixinName, dependsOn[, dependsOn, ...])
* ***mixinName***: (string) the alias to be used when including the mixin for a React component
* ***dependsOn***: (string or array) the alias of another mixin that must be included if this mixin is included

Define an alias which can be used to include multiple mixins.  This is similar to registering a mixin with dependencies without including the actual mixin.


API: Mixins
----------------
### deferUpdate

#### deferUpdate()

This is similar to the standard *forceUpdate* but after a setTimeout(0).  Any calls to deferUpdate before the callback fires will execute only a single ```forceUpdate``` call.  This can be beneficial for mixins that listen to certain events that might cause a render multiple times unnecessarily.
