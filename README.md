react-mixin-manager
========================
Enhance React with full-featured mixin dependency management.

* Mixins can be registered by a simple alias
* Mixins can depend on other mixins to reduce DRY and create more granular mixins
* Third party mixins can be overridden to increase flexibility
* Reduce the chance of mixin attribute duplication

```
// register a mixin to an alias
React.mixins.add('the-alias', myMixin);

// reference the alias when creating a component
React.createClass({
  mixins: ['the-alias']
})
```

[View the fancydocs](http://jhudson8.github.io/fancydocs/index.html#project/jhudson8/react-mixin-manager)


API
------------

### React.mixins

#### add (mixinName, mixin[, dependsOn, dependsOn, ...]) or (options, mixin[, dependsOn, dependsOn, ...])
* ***mixinName***: (string) the alias to be used when including the mixin for a React component
* ***options***: (object) {mixinName (required), initiatedOnce (optional)}
* ***initiatedOnce***: (boolean) defines how parameterized mixins are executed;  see "Mixins With Parameters" for more details
* ***mixin***: the mixin object
* ***dependsOn***: (string or array) the alias of another mixin that must be included if this mixin is included

Register the mixin to be referenced as the alias `mixinName` with any additional dependencies (by alias) as additional arguments.  This *will not* replace an existing mixin by that alias.

##### Examples

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
  // mixin1Impl, mixin2Impl, anyOtherPlainOldMixin will be included (a named mixin will never be included multiple times)
  mixins: ['mixin2', anyOtherPlainOldMixin]
})
```

*Mixin with parameters*
```

// 1. simple example

// register myMixinImpl as the alias "myMixin" and pass initiatedOnce parameter as true
React.mixins.add({name: 'myMixin', initiatedOnce: true}, myMixinImpl);
...
React.createClass({
  mixins: ['myMixin("foo")', 'myMixin("bar")', anyOtherPlainOldMixin]
})
// myMixinImpl(["foo"], ["bar"]), anyOtherPlainOldMixin will be included (a named mixin will never be included multiple times).
// myMixin will be initiated once with all parameters which were provided to.

...
React.createClass({
  mixins: ['myMixin("foo", "test")', 'myMixin("bar")', anyOtherPlainOldMixin]
})
// myMixinImpl(["foo", "test"], ["bar"]), anyOtherPlainOldMixin will be included (a named mixin will never be included multiple times).
// myMixin will be initiated once with all parameters which were provided to.


// 2. more difficult use case

// register initiatedOnceMixinImpl as the alias "initiatedOnceMixin" and pass initiatedOnce as true
React.mixins.add({name: 'initiatedOnceMixin', initiatedOnce: true}, initiatedOnceMixinImpl);
// register another mixin which has "InitiatedOnceMixin" with some parameters as dependency
React.mixins.add('myMixin', myMixinImpl, 'initiatedOnceMixin("foo")');
...
React.createClass({
  mixins: ['initiatedOnceMixin("bar")', 'myMixin', anyOtherPlainOldMixin]
  // myMixinImpl, initiatedOnceMixinImpl(["bar"], ["foo"]), anyOtherPlainOldMixin will be included
});


// 3. process the parameters

var _ = require('underscore');

// we have initiatedOnceMixinImpl that requires arguments as a flatten array
// create wrapper that will process arguments
var wrappedMixinImpl = function(){
  var params = Array.prototype.slice.call(arguments, 0);
  var flattenParams = _.flatten(params);

  return initiatedOnceMixinImpl.apply(this, flattenParams);
};
// register wrappedMixinImpl as the alias "initiatedOnceMixin" and pass initiatedOnce as true
React.mixins.add({name: 'initiatedOnceMixin', initiatedOnce: true}, wrappedMixinImpl);
...
React.createClass({
  mixins: ['initiatedOnceMixin("foo", "test")', 'initiatedOnceMixin("bar")', anyOtherPlainOldMixin]
  // initiatedOnceMixinImpl("foo", "test", "bar"), anyOtherPlainOldMixin will be included
});
```

***note***: if the registered mixin is a function, it will be executed and the return value will be used as the mixin



#### replace (mixinName, mixin[, dependsOn, dependsOn, ...]) or (options, mixin[, dependsOn, dependsOn, ...])
* ***mixinName***: (string) the alias to be used when including the mixin for a React component
* ***options***: (object) {mixinName (required), initiatedOnce (optional)}
* ***initiatedOnce***: (boolean) defines how parameterized mixins are executed;  see "Mixins With Parameters" for more details
* ***mixin***: the mixin object
* ***dependsOn***: (string or array) the alias of another mixin that must be included if this mixin is included

Same as ```React.mixins.add``` but it *will replace* an existing mixin with the same alias.



#### inject(mixinName, dependsOn[, dependsOn, ...])
* ***mixinName***: (string) the alias to be used when including the mixin for a React component
* ***dependsOn***: (string or array) the alias of another mixin that must be included if this mixin is included

Add additional dependencies to a mixin that has already been registered.  This is not useful for mixins that you create but can be useful to group additional mixins when 3rd party mixins are referenced.

##### Examples
```
// register myMixinImpl as the alias "myMixin"
React.mixins.add('myMixin', myMixinImpl);

// "tpMixin" is a 3rd party mixin that has already been registered which has no dependencies
React.mixins.inject('tpMixin', 'myMixin');
...
React.createClass({
  // "tpMixin" and "myMixin" will be included
  mixins: ['tpMixin']
})

```


#### alias(mixinName, dependsOn[, dependsOn, ...])
* ***mixinName***: (string) the alias to be used when including the mixin for a React component
* ***dependsOn***: (string or array) the alias of another mixin that must be included if this mixin is included

Define an alias which can be used to group multiple named mixins together so that a single mixin alias will import all grouped mixins.

##### Examples
```
// register mixin1Impl as the alias "mixin1"
React.mixins.add('mixin1', mixin1Impl);

// register mixin2Impl as the alias "mixin2"
React.mixins.add('mixin1', mixin1Impl);

// group these mixins into a single alias "all" that can be referenced
React.mixins.alias('all', 'mixin1', 'mixin2');

...
React.createClass({
  // "mixin1" and "mixin2" will be included
  mixins: ['all']
})
```


API: Mixins
----------------
### deferUpdate
Mixin used to make available a single function ```deferUpdate``` to your component.

#### deferUpdate()

This is similar to [forceUpdate](http://facebook.github.io/react/docs/component-api.html) but after a setTimeout(0).  Any calls to deferUpdate before the callback fires will execute only a single [forceUpdate](http://facebook.github.io/react/docs/component-api.html) call.  This can be beneficial for mixins that listen to certain events that might cause a render multiple times unnecessarily.

##### Examples
```
React.createClass({
  mixin: ['deferUpdate'],

  somethingThatRequiresUpdate: function() {
    this.deferUpdate();
  }
});
```


Sections
---------------

### Installation
* Browser: include *react-mixin-manager[.min].js* after [React](http://facebook.github.io/react/)
* CommonJS: ```require('react-mixin-manager')(require('react'));```


### Advanced Features

#### Dynamic Mixins

If the mixin that is registered is a function, the result of that function will be used as the actual mixin provided to the React component.  This can be useful if runtime conditions need to be evaluated to determine what should be exposed to the component.

```
React.mixins.add('myMixin', function() {
  if (window.something) {
    return mixin1;
  } else {
    return mixin2;
  }
});
...
var myComponent = React.createClass({
  mixins: ['myMixin'],
  ...
});
```
In this example, when *myComponent* is declared (not instantiated), based on the *something* global variable, either *mixin1* or *mixin2* will be applied.


#### Mixins With Parameters

It is occasionally useful to add dynamic behavior to the mixin that is not based on some property set by the parent but rather a property that is internally defined by the component being instantiated.  This can be done by using *Dynamic Mixins* (see above).  When a function is used to return the mixin, any parameters supplied when referencing the mixin will supplied as arguments.

```
React.mixins.add('myMixin', function(something) {
  if (something) {
    return mixin1;
  } else {
    return mixin2;
  }
});
...
var myComponent = React.createClass({
  mixins: ['myMixin("foo")'],
  ...
});
```
In this example, when *myComponent* is declared (not instantiated), based on the *something* variable provided by the React component using the mixin, either *mixin1* or *mixin2* will be applied.

*note: booleans and numbers can be used as well so make sure to wrap strings with quotes*
