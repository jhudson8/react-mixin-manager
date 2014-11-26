registerProject({"title":"react-mixin-manager","summary":"Enhance React with full-featured mixin dependency management.\n\n* Register mixins using a string alias\n* Allow mixins to depend on other mixins\n* Reduce the chance of mixin attribute duplication\n* Provide dynamic mixins using reference parameters\n\n\n\n### Installation\n* Browser: include *react-mixin-manager[.min].js* after [React](#link/http%3A%2F%2Ffacebook.github.io%2Freact%2F)\n* CommonJS: ```require('react-mixin-manager')(require('react'));```\n\n### Projects using react-mixin-manager\n* [npm](#link/https%3A%2F%2Fwww.npmjs.org%2Fbrowse%2Fkeyword%2Freact-mixin-manager)\n* [bower](#link/http%3A%2F%2Fbower.io%2Fsearch%2F%3Fq%3Dreact-mixin-manager)\n\nadd \"react-mixin-manager\" keyword to your project to be included in this list\n\n### Common Examples\nInclude a mixin registered with react-mixin-manager to your component class\n```\nReact.createClass({\n  mixins: ['mixinAlias']\n});\n```\n\nRegister a mixin as an alias\n```\nReact.mixins.add('mixinAlias', myMixin);\n```\n\nRegister a mixin dependency\n```\n// \"dependantMixin\" will be included whenever \"mixinAlias\" is included on a component\nReact.mixins.add('mixinAlias', myMixin, 'dependantMixin');\n```\n\nInclude a mixin with parameters to your component (see Advanced Features for more details)\n```\nReact.createClass({\n  // the parameters to the mixin are \"param 1\" and \"param 2\"\n  mixins: ['mixin alias(\"param 1\", \"param 2\")']\n});\n```","api":{"API":{"methods":{},"packages":{"React.mixins":{"overview":"","methods":{"add":{"profiles":["mixinName, mixin[, dependsOn, dependsOn, ...]) or (options, mixin[, dependsOn, dependsOn, ...]"],"params":{"mixinName":"(string) the alias to be used when including the mixin for a React component","options":"(object) {mixinName (required), initiatedOnce (optional)}","initiatedOnce":"(boolean) defines how parameterized mixins are executed;  see \"Mixins With Parameters\" for more details","mixin":"the mixin object","dependsOn":"(string or array) the alias of another mixin that must be included if this mixin is included"},"summary":"Register the mixin to be referenced as the alias `mixinName` with any additional dependencies (by alias) as additional arguments.  This *will not* replace an existing mixin by that alias.","dependsOn":[],"overview":"##### Examples\n\n*Standard mixin*\n```\n// register myMixinImpl as the alias \"myMixin\"\nReact.mixins.add('myMixin', myMixinImpl);\n...\nReact.createClass({\n  mixins: ['myMixin', anyOtherPlainOldMixin]\n})\n// myMixinImpl, anyOtherPlainOldMixin will be included\n```\n\n*Mixin with dependencies*\n```\n// register mixin1Impl as the alias \"mixin1\"\nReact.mixins.add('mixin1', mixin1Impl);\n// register mixin2Impl as the alias \"mixin2\" with a dependency on the mixin defined by the alias \"mixin1\"\nReact.mixins.add('mixin2', mixin2Impl, 'mixin1');\n...\nReact.createClass({\n  // mixin1Impl, mixin2Impl, anyOtherPlainOldMixin will be included (a named mixin will never be included multiple times)\n  mixins: ['mixin2', anyOtherPlainOldMixin]\n})\n```\n\n***note***: if the registered mixin is a function, it will be executed and the return value will be used as the mixin\n\nSee \"Mixins with Parameters\" for advanced features"},"replace":{"profiles":["mixinName, mixin[, dependsOn, dependsOn, ...]) or (options, mixin[, dependsOn, dependsOn, ...]"],"params":{"mixinName":"(string) the alias to be used when including the mixin for a React component","options":"(object) {mixinName (required), initiatedOnce (optional)}","initiatedOnce":"(boolean) defines how parameterized mixins are executed;  see \"Mixins With Parameters\" for more details","mixin":"the mixin object","dependsOn":"(string or array) the alias of another mixin that must be included if this mixin is included"},"summary":"Same as ```React.mixins.add``` but it *will replace* an existing mixin with the same alias.","dependsOn":[],"overview":""},"inject":{"profiles":["mixinName, dependsOn[, dependsOn, ...]"],"params":{"mixinName":"(string) the alias to be used when including the mixin for a React component","dependsOn":"(string or array) the alias of another mixin that must be included if this mixin is included"},"summary":"Add additional dependencies to a mixin that has already been registered.  This is not useful for mixins that you create but can be useful to group additional mixins when 3rd party mixins are referenced.","dependsOn":[],"overview":"##### Examples\n```\n// register myMixinImpl as the alias \"myMixin\"\nReact.mixins.add('myMixin', myMixinImpl);\n\n// \"tpMixin\" is a 3rd party mixin that has already been registered which has no dependencies\nReact.mixins.inject('tpMixin', 'myMixin');\n...\nReact.createClass({\n  // \"tpMixin\" and \"myMixin\" will be included\n  mixins: ['tpMixin']\n})\n\n```"},"alias":{"profiles":["mixinName, dependsOn[, dependsOn, ...]"],"params":{"mixinName":"(string) the alias to be used when including the mixin for a React component","dependsOn":"(string or array) the alias of another mixin that must be included if this mixin is included"},"summary":"Define an alias which can be used to group multiple named mixins together so that a single mixin alias will import all grouped mixins.","dependsOn":[],"overview":"##### Examples\n```\n// register mixin1Impl as the alias \"mixin1\"\nReact.mixins.add('mixin1', mixin1Impl);\n\n// register mixin2Impl as the alias \"mixin2\"\nReact.mixins.add('mixin1', mixin1Impl);\n\n// group these mixins into a single alias \"all\" that can be referenced\nReact.mixins.alias('all', 'mixin1', 'mixin2');\n\n...\nReact.createClass({\n  // \"mixin1\" and \"mixin2\" will be included\n  mixins: ['all']\n})\n```"},"setState":{"profiles":["state, context"],"params":{"state":"(object) object containing any values to be set as state","context":"(ReactComponent) \"this\" when calling this method from a ReactComponent"},"summary":"Allows ReactComponents to call methods which mutate state before the ReactComponent.state has been initialized (in getInitialState).\nThis is used, for example, in [react-events](#link/https%3A%2F%2Fgithub.com%2Fjhudson8%2Freact-events) to allow the ```listenTo``` method to be called within ```getInitialState```.","dependsOn":[],"overview":"##### Examples\n```\n  getInitialState: function() {\n    React.mixins.setState({foo: 'bar'}, this);\n  }\n```"},"getState":{"profiles":["key, context"],"params":{"key":"(string) the key referencing the state attribute to be retrieved","context":"(ReactComponent) \"this\" when calling this method from a ReactComponent"},"summary":"Return the state attribute which was set using ```React.mixins.setState```.","dependsOn":[],"overview":"##### Examples\n```\n  getInitialState: function() {\n    var foo = React.mixins.getState('foo', this);\n  }\n```"}}}}},"Mixins":{"methods":{},"packages":{"deferUpdate":{"overview":"Mixin used to make available a single function ```deferUpdate``` to your component.","methods":{"deferUpdate":{"profiles":[""],"params":{},"summary":"This is similar to [forceUpdate](#link/http%3A%2F%2Ffacebook.github.io%2Freact%2Fdocs%2Fcomponent-api.html) but after a setTimeout(0).  Any calls to deferUpdate before the callback fires will execute only a single [forceUpdate](#link/http%3A%2F%2Ffacebook.github.io%2Freact%2Fdocs%2Fcomponent-api.html) call.  This can be beneficial for mixins that listen to certain events that might cause a render multiple times unnecessarily.","dependsOn":[],"overview":"##### Examples\n```\nReact.createClass({\n  mixin: ['deferUpdate'],\n\n  somethingThatRequiresUpdate: function() {\n    this.deferUpdate();\n  }\n});\n```"}}},"state":{"overview":"Very simple mixin that ensures that the component state is an object.  This is useful if you\nknow a component will be using state but won't be initialized with a state to prevent a null check on render","methods":{}}}}},"sections":[{"body":"","title":"Advanced Features","sections":[{"body":"If the mixin that is registered is a function, the result of that function will be used as the actual mixin provided to the React component.  This can be useful if runtime conditions need to be evaluated to determine what should be exposed to the component.\n\n```\nReact.mixins.add('myMixin', function() {\n  if (window.something) {\n    return mixin1;\n  } else {\n    return mixin2;\n  }\n});\n...\nvar myComponent = React.createClass({\n  mixins: ['myMixin'],\n  ...\n});\n```\nIn this example, when *myComponent* is declared (not instantiated), based on the *something* global variable, either *mixin1* or *mixin2* will be applied.","title":"Dynamic Mixins","sections":[]},{"body":"It is occasionally useful to add dynamic behavior to the mixin that is not based on some property set by the parent but rather a property that is internally defined by the component being instantiated.  This can be done by using *Dynamic Mixins* (see above).  When a function is used to return the mixin, any parameters supplied when referencing the mixin will supplied as arguments.\n\n```\nReact.mixins.add('myMixin', function(something) {\n  if (something) {\n    return mixin1;\n  } else {\n    return mixin2;\n  }\n});\n...\nvar myComponent = React.createClass({\n  mixins: ['myMixin(\"foo\")'],\n  ...\n});\n```\nIn this example, when *myComponent* is declared (not instantiated), based on the *something* variable provided by the React component using the mixin, either *mixin1* or *mixin2* will be applied.\n\n*note: booleans and numbers can be used as well so make sure to wrap strings with quotes*\n\n\nThe ***initiatedOnce*** option can be used when registering a mixin to ensure that the mixin is only called a single time regardless of how many parameterized references of that mixin there are for a React class.  In this case, the mixin function will accept a single parameter which is an array of argument arrays representing each parameterized mixin reference.\n\n```\n// register initiatedOnceMixinImpl as the alias \"initiatedOnceMixin\" and pass initiatedOnce as true\nReact.mixins.add({name: 'initiatedOnceMixin', initiatedOnce: true}, initiatedOnceMixinImpl);\n\n// register another mixin which has \"InitiatedOnceMixin\" with some parameters as dependency\nReact.mixins.add('myMixin', myMixinImpl, 'initiatedOnceMixin(\"foo\", \"fee\")');\n...\nReact.createClass({\n  mixins: ['initiatedOnceMixin(\"bar\")', 'myMixin', anyOtherPlainOldMixin]\n  // myMixinImpl, initiatedOnceMixinImpl([\"bar\"], [\"foo\"]), anyOtherPlainOldMixin will be included\n});\n```\n\nIn the above case, if the mixin function were to log the parameters it received\n```\nReact.mixins.add({name: 'initiatedOnceMixin', initiatedOnce: true}, function(args) {\n  console.log(JSON.stringify(args));\n});\n```\n\nThe output would look like\n```\n[[\"foo\",\"fee\"],[\"bar\"]]\n\n// [\"foo\", \"fee\"] from the mixin dependency reference\n// [\"bar\"] from the react class mixin reference\n```","title":"Mixins With Parameters","sections":[]}]}]});
