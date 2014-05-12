react-mixin-manager
========================

React-mixin-manager is a simple manager which allows mixins to be referenced by an alias and include dependencies on other mixins (by their alias):

1. React mixins can be much more granular (because they are reused)
2. Reduce a lot of DRY code when it comes to mixins because they can depend on existing functionality
3. Less change of mixin duplicate function name collision (because they are more granular and reused)
4. 3rd party mixins can expose internal behaviors as granular mixins to be overridden by consumers

Installation
------------
* Browser: include *react-mixin-manager[.min].js* after [React](http://facebook.github.io/react/)
* CommonJS: ```require('react-mixin-manager')(require('react'));```

Usage
------------
A ```mixins``` object is added to the *React* object which includes the following functions:

```
add(mixinName, mixin[, dependsOn, dependsOn, ...])
```
Register the mixin to be referenced as the alias `mixinName` with any additional dependencies (by alias) as additional arguments.  This *will not* replace an existing mixin by that alias.

```
replace(mixinName, mixin[, dependsOn, dependsOn, ...])
```
Same as above but it *will replace* an existing mixin with the same alias.


Standard alias replacement
```
// register myMixinImpl as the alias "myMixin"
React.mixins.add('myMixin', myMixinImpl);
...
React.createClass({
  mixins: ['myMixin', anyOtherPlainOldMixin]
})
// myMixinImpl, anyOtherPlainOldMixin will be included
```

Mixin dependencies
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

see [more examples](https://github.com/jhudson8/react-mixin-manager/blob/master/test/test.js#L17)
