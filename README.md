react-mixin-dependencies
========================

Simple registration system for react mixins easily allow mixins to depend on other mixins.

This allows for more granular mixins and less DRY mixin code.

Installation
------------
* Browser: include *react-mixin-dependencies.js/react-mixin-dependencies.min.js* after [React](http://facebook.github.io/react/)
* CommonJS: ```require('react-mixin-dependencies')(require('react'));```

Usage
------------
A ```mixins``` object is added to the *React* object which includes the following functions:
* add(mixinName, mixinImpl[, dependsOn, dependsOn, ...]);
* get([mixinNameOrImpl, mixinNameOrImpl, ...]) // returns an array of mixins ready to assign to the ```mixins``` attribute when creating a React class

Mixins can be registered and named for ease of use (and resuse as mixins can depend on other mixins by name)
```
React.mixins.add('myMixin', myMixinImpl);
...
React.createClass({
  mixins: React.mixins.get('myMixin', anyOtherPlainOldMixin)
})
// myMixinImpl, anyOtherPlainOldMixin will be included
```

Registered mixins can reference dependencies
```
React.mixins.add('mixin1', mixin1Impl);
// mixin1Impl will be included automatically whenever 'mixin2' is referenced
React.mixins.add('mixin2', mixin2Impl, 'mixin1');
...
React.createClass({
  mixins: React.mixins.get('mixin2', anyOtherPlainOldMixin)
})
// mixin1Impl, mixin2Impl, anyOtherPlainOldMixin will be included (a named mixin will never be included multiple times)
```

see [more examples](https://github.com/jhudson8/react-mixin-dependencies/blob/master/test/test.js#L17)