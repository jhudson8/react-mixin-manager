react-mixin-dependencies
========================

Simple registration system for react mixins easily allow mixins to depend on other mixins.

This allows for more granular mixins and less DRY mixin code.

Installation
------------
* Browser: include *react-mixin-dependencies.js* after [React](http://facebook.github.io/react/)
* CommonJS: ```require('react-mixin-dependencies')(require('react'));```
* AMD: add *react-mixin-dependencies-amd.js*

Usage
------------
Mixins can be registered and named for ease of use
```
React.mixins.add('myMixin', myMixin);
...
React.createClass({
  mixins: React.mixins.get('myMixin', anyOtherPlainOldMixin)
})
// myMixin, anyOtherPlainOldMixin will be included
```

Registered mixins can reference dependencies
```
React.mixins.add('mixin1', mixin1);
// 'mixin1' will be included automatically whenever 'mixin2' is referenced
React.mixins.add('mixin2', mixin1, 'mixin1');
...
React.createClass({
  mixins: React.mixins.get('mixin2', anyOtherPlainOldMixin)
})
// mixin1, mixin2, anyOtherPlainOldMixin will be included (a named mixin will never be included multiple times)
```
