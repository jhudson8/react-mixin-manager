react-mixin-manager
========================

* Register mixins using a string alias
* Allow mixins to depend on other mixins
* Reduce the chance of mixin attribute duplication
* Provide dynamic mixins using reference parameters

### Common Examples
Include a mixin registered with react-mixin-manager to your component class

```
    React.createClass({
      mixins: ['mixinAlias']
    });
```

Register a mixin as an alias

```
    require('react-mixin-manager).add('mixinAlias', myMixin);
```

Register a mixin dependency

```
    // "dependantMixin" will be included whenever "mixinAlias" is included on a component
    require('react-mixin-manager).add('mixinAlias', myMixin, 'dependantMixin');
```

Include a mixin with parameters to your component (see Advanced Features for more details)

```
    React.createClass({
      // the parameters to the mixin are "param 1" and "param 2"
      mixins: ['mixin alias("param 1", "param 2")']
    });
```

Installation
--------------
Browser:

The react-mixin-manager object can be referenced ```ReactMixinManager```
```
    <script src=".../react[-min].js"></script>
    <script src=".../react-mixin-manager[-min].js"></script>
```

CommonJS

No initialization necessary
```javascript
    var ReactMixinManager = require('react-mixin-manager');
```

AMD

No initialization necessary
```javascript
    require(['react-mixin-manager'], function(ReactMixinManager) {
      ...
    });
```

Projects using react-mixin-manager
---------------
* [npm](https://www.npmjs.org/browse/keyword/react-mixin-manager)
* [bower](http://bower.io/search/?q=react-mixin-manager)

add "react-mixin-manager" keyword to your project to be included in this list


API
------------
### react-mixin-manager

#### add (mixinName, mixin[, dependsOn, dependsOn, ...]) or (options, mixin[, dependsOn, dependsOn, ...])
* ***mixinName***: (string) the alias to be used when including the mixin for a React component
* ***options***: (object) {mixinName (required), initiatedOnce (optional)}
* ***initiatedOnce***: (boolean) defines how parameterized mixins are executed;  see "Mixins With Parameters" for more details
* ***mixin***: the mixin object
* ***dependsOn***: (string or array) the alias of another mixin that must be included if this mixin is included

Register the mixin to be referenced as the alias `mixinName` with any additional dependencies (by alias) as additional arguments.  This *will* replace an existing mixin if already registered using the same alias.

If the name contains a dot "." the prefix is assumed to be the namespace.  A mixin can be retrieved by either using the fully qualified name or the suffix.  The first mixin to be added with any suffix will be returned if there are 2 different namespaces with the same suffix.

```javascript
    require('react-mixin-manager).add('namespace-a.foo', aFoo);
    require('react-mixin-manager).add('namespace-b.foo', bFoo);
    mixins: ['foo'] // will result to [aFoo]
    mixins: ['namespace-a.foo'] // will result to [aFoo]
    mixins: ['namespace-b.foo'] // will result to [bFoo]
```

##### Examples

*Standard mixin*

```javascript
    // register myMixinImpl as the alias "myMixin"
    require('react-mixin-manager).add('myMixin', myMixinImpl);
    ...
    React.createClass({
      mixins: ['myMixin', anyOtherPlainOldMixin]
    })
    // myMixinImpl, anyOtherPlainOldMixin will be included
```

*Mixin with dependencies*

```javascript
    // register mixin1Impl as the alias "mixin1"
    require('react-mixin-manager).add('mixin1', mixin1Impl);
    // register mixin2Impl as the alias "mixin2" with a dependency on the mixin defined by the alias "mixin1"
    require('react-mixin-manager).add('mixin2', mixin2Impl, 'mixin1');
    ...
    React.createClass({
      // mixin1Impl, mixin2Impl, anyOtherPlainOldMixin will be included (a named mixin will never be included multiple times)
      mixins: ['mixin2', anyOtherPlainOldMixin]
    })
```

***note***: if the registered mixin is a function, it will be executed and the return value will be used as the mixin

See "Mixins with Parameters" for advanced features


#### inject(mixinName, dependsOn[, dependsOn, ...])
* ***mixinName***: (string) the alias to be used when including the mixin for a React component
* ***dependsOn***: (string or array) the alias of another mixin that must be included if this mixin is included

Add additional dependencies to a mixin that has already been registered.  This is not useful for mixins that you create but can be useful to group additional mixins when 3rd party mixins are referenced.

```javascript
    // register myMixinImpl as the alias "myMixin"
    require('react-mixin-manager).add('myMixin', myMixinImpl);

    // "tpMixin" is a 3rd party mixin that has already been registered which has no dependencies
    require('react-mixin-manager).inject('tpMixin', 'myMixin');
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

```javascript
    // register mixin1Impl as the alias "mixin1"
    require('react-mixin-manager).add('mixin1', mixin1Impl);

    // register mixin2Impl as the alias "mixin2"
    require('react-mixin-manager).add('mixin1', mixin1Impl);

    // group these mixins into a single alias "all" that can be referenced
    require('react-mixin-manager).alias('all', 'mixin1', 'mixin2');

    ...
    React.createClass({
      // "mixin1" and "mixin2" will be included
      mixins: ['all']
    })
```


#### setState(state, context)
* ***state***: (object) object containing any values to be set as state
* ***context***: (ReactComponent) "this" when calling this method from a ReactComponent

Allows ReactComponents to call methods which mutate state before the ReactComponent.state has been initialized (in getInitialState).
This is used, for example, in [react-events](https://github.com/jhudson8/react-events) to allow the ```listenTo``` method to be called within ```getInitialState```.

```javascript
    getInitialState: function() {
      require('react-mixin-manager).setState({foo: 'bar'}, this);
    }
```


#### getState(key, context)
* ***key***: (string) the key referencing the state attribute to be retrieved
* ***context***: (ReactComponent) "this" when calling this method from a ReactComponent

Return the state attribute which was set using ```require('react-mixin-manager).setState```.

```javascript
    getInitialState: function() {
      var foo = require('react-mixin-manager).getState('foo', this);
    }
```


API: Mixins
----------------
### deferUpdate
Mixin used to make available a single function ```deferUpdate``` to your component.

#### deferUpdate()

This is similar to [forceUpdate](http://facebook.github.io/react/docs/component-api.html) but moved to the next event loop (or after a set interval).  Any calls to deferUpdate before the callback fires will execute only a single [forceUpdate](http://facebook.github.io/react/docs/component-api.html) call.  This can be beneficial for mixins that listen to certain events that might cause a render multiple times unnecessarily.  [react-backbone](https://github.com/jhudson8/react-backbone), for example, uses this feature heavily.

```require('react-mixin-manager).defaultDeferUpdateInterval``` can be used to set the interval in milis between the ```deferUpdate``` call and the actual ```forceUpdate``` call.  A value < 0 will not defer the ```forceUdpate``` call (beneficial only to change behavior of 3rd party mixins that depend on this functionality).


```javascript
    React.createClass({
      mixin: ['deferUpdate'],

      somethingThatRequiresUpdate: function() {
        this.deferUpdate();
      }
    });
```

The defer interval can also be adjusted on a per component basis.  Any mixins registered as dependencies of the React component will obey the value that is set for the component.  It can be set using the mixin parameter.

```javascript
    React.createClass({
      // call forceUpdate 100 ms after the deferUpdate call
      mixin: ['deferUpdate(100)'],

      somethingThatRequiresUpdate: function() {
        this.deferUpdate();
      }
    });
```


### state
Very simple mixin that ensures that the component state is an object.  This is useful if you
know a component will be using state but won't be initialized with a state to prevent a null check on render


Sections
---------------

### Advanced Features

#### Non-registered mixins with dependencies

You can still define dependencies when referring to object mixins by using the ```mixins``` attribute just as if the mixin were a component class definition.

```javascript
    var myMixin = {
      mixins: [...]
    };
    var MyClass = React.createClass({
      mixins: [myMixin]
    });
```

#### Dynamic Mixins

If the mixin that is registered is a function, the result of that function will be used as the actual mixin provided to the React component.  This can be useful if runtime conditions need to be evaluated to determine what should be exposed to the component.

```javascript
    require('react-mixin-manager).add('myMixin', function() {
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

```javascript
    require('react-mixin-manager).add('myMixin', function(something) {
      if (something === 'foo') {
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


#### Mixin initiated once with multiple references
The ***initiatedOnce*** option can be used when registering a mixin to ensure that the mixin is only called a single time regardless of how many parameterized references of that mixin there are for a React class (or any of the mixin dependencies for that class).  In this case, the mixin function will accept a single parameter which is an array of argument arrays representing each parameterized mixin reference.

```javascript
    // register initiatedOnceMixinImpl as the alias "initiatedOnceMixin" and pass initiatedOnce as true
    require('react-mixin-manager).add({name: 'initiatedOnceMixin', initiatedOnce: true}, initiatedOnceMixinImpl);

    // register another mixin which has "InitiatedOnceMixin" with some parameters as dependency
    require('react-mixin-manager).add('myMixin', myMixinImpl, 'initiatedOnceMixin("foo", "fee")');
    ...
    React.createClass({
      mixins: ['initiatedOnceMixin("bar")', 'myMixin']
    });
```

The above case will call the ```initiatedOnceMixinImpl``` like below

```javascript
    initiatedOnceMixinImpl = function(args) {
      // args = [
      //    ['foo', 'fee'], // from the first "initiatedOnceMixin" reference
      //    ['bar'] // from the second "initiatedOnceMixin" reference
      // ]
      return ...
    }
```
