/*!
 * react-mixin-manager v0.9.4
 * https://github.com/jhudson8/react-mixin-manager
 *
 *
 * Copyright (c) 2014 Joe Hudson<joehud_AT_gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function(main) {
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            // with AMD
            //  require(
            //    ['react', react-mixin-manager'], function(React, reactMixinManager) {
            //    reactMixinManager(React); 
            //  });
            return main;
        });
    } else if (typeof exports !== 'undefined' && typeof require !== 'undefined') {
        // with CommonJS
        // require('react-mixin-manager')(require('react'));
        module.exports = main;
    } else {
        main(React);
    }
})(function(React) {

    // main body start
    var _dependsOn = {};
    var _dependsInjected = {};
    var _mixins = {};
    var _initiatedOnce = {};

    function setState(state, context) {
        if (context.isMounted()) {
            context.setState(state);
        } else if (context.state) {
            for (var name in state) {
                if (state.hasOwnProperty(name)) {
                    context.state[name] = state[name];
                }
            }
        } else {
            // if we aren't mounted, we will get an exception if we try to set the state
            // so keep a placeholder state until we're mounted
            // this is mainly useful if setModel is called on getInitialState
            var _state = context.__temporary_state || {};
            /*jshint -W004 */
            for (var name in state) {
                if (state.hasOwnProperty(name)) {
                    _state[name] = state[name];
                }
            }
            context.__temporary_state = _state;
        }
    }

    function getState(key, context) {
        var state = context.state,
            initState = context.__temporary_state;
        return (state && state[key]) || (initState && initState[key]);
    }

    /**
     * return the normalized mixin list
     * @param values {Array} list of mixin entries
     * @param index {Object} hash which contains a truthy value for all named mixins that have been added
     * @param initiatedOnce {Object} hash which collects mixins and their parameters that should be initiated once
     * @param rtn {Array} the normalized return array
     */
    function get(values, index, initiatedOnce, rtn) {
        /**
         * add the named mixin and all un-added dependencies to the return array
         * @param the mixin name
         */
        function addTo(name) {
            var indexName = name,
                match = name.match(/^([^\(]*)\s*\(([^\)]*)\)\s*/),
                params = match && match[2];
            name = match && match[1] || name;

            if (!index[indexName]) {
                if (params) {
                    // there can be no function calls here because of the regex match
                    /*jshint evil: true */
                    params = eval('[' + params + ']');
                }
                var mixin = _mixins[name],
                    checkAgain = false,
                    skip = false;

                if (mixin) {
                    if (typeof mixin === 'function') {
                        if (_initiatedOnce[name]) {
                            if (!initiatedOnce[name]) {
                                initiatedOnce[name] = [];
                                // add the placeholder so the mixin ends up in the right place
                                // we will replace all names with the appropriate mixins at the end
                                // (so we have all of the appropriate arguments)
                                mixin = name;
                            } else {
                                // but we only want to add it a single time
                                skip = true;
                            }
                            if (params) {
                                initiatedOnce[name].push(params);
                            }
                        } else {
                            mixin = mixin.apply(this, params || []);
                            checkAgain = true;
                        }
                    } else if (params) {
                        throw new Error('the mixin "' + name + '" does not support parameters');
                    }
                    get(_dependsOn[name], index, initiatedOnce, rtn);
                    get(_dependsInjected[name], index, initiatedOnce, rtn);

                    index[indexName] = true;
                    if (checkAgain) {
                        get([mixin], index, initiatedOnce, rtn);
                    } else if (!skip) {
                        rtn.push(mixin);
                    }

                } else {
                    throw new Error('invalid mixin "' + name + '"');
                }
            }
        }

        function handleMixin(mixin) {
            if (mixin) {
                if (Array.isArray(mixin)) {
                    // flatten it out
                    get(mixin, index, initiatedOnce, rtn);
                } else if (typeof mixin === 'string') {
                    // add the named mixin and all of it's dependencies
                    addTo(mixin);
                } else {
                    // if the mixin has a "mixins" attribute, clone and add those dependencies first
                    if (mixin.mixins) {
                        get(mixin.mixins, index, initiatedOnce, rtn);
                        var _mixin = _mixins[mixin];
                        if (!_mixin) {
                            _mixin = {};
                            for (var key in mixin) {
                                if (key !== 'mixins') {
                                    _mixin[key] = mixin[key];
                                }
                            }
                        }
                        _mixins[mixin] = _mixin;
                        mixin = _mixin;
                    }

                    // just add the mixin normally
                    rtn.push(mixin);
                }
            }
        }

        if (Array.isArray(values)) {
            for (var i = 0; i < values.length; i++) {
                handleMixin(values[i]);
            }
        } else {
            handleMixin(values);
        }
    }

    /**
     * add the mixins that should be once initiated to the normalized mixin list
     * @param mixins {Object} hash of mixins keys and list of its parameters
     * @param rtn {Array} the normalized return array
     */
    function applyInitiatedOnceArgs(mixins, rtn) {

        /**
         * added once initiated mixins to return array
         */
        function addInitiatedOnce(name, mixin, params) {
            mixin = mixin.call(this, params || []);
            // find the name placeholder in the return arr and replace it with the mixin
            var index = rtn.indexOf(name);
            rtn.splice(index, 1, mixin);
        }

        for (var m in mixins) {
            if (mixins.hasOwnProperty(m)) {
                addInitiatedOnce(m, _mixins[m], mixins[m]);
            }
        }
    }

    // allow for registered mixins to be extract just by using the standard React.createClass
    var _createClass = React.createClass;
    React.createClass = function(spec) {
        if (spec.mixins) {
            spec.mixins = React.mixins.get(spec.mixins);
        }
        return _createClass.apply(React, arguments);
    };

    function addMixin(name, mixin, depends, override, initiatedOnce) {
        if (!override && _mixins[name]) {
            return;
        }
        if (depends.length) {
            _dependsOn[name] = depends;
        }
        _mixins[name] = mixin;

        if (initiatedOnce) {
            _initiatedOnce[name] = true;
        }
    }

    function GROUP() {
        // empty function which is used only as a placeholder to list dependencies
    }

    function mixinParams(args, override) {
        var name,
            options = args[0],
            initiatedOnce = false;

        if (typeof(options) === 'object') {
            name = options.name;
            initiatedOnce = options.initiatedOnce;
        } else {
            name = options;
        }

        if (!name || !name.length) {
            throw new Error('the mixin name hasn\'t been specified');
        }

        if (Array.isArray(args[1])) {
            return [name, args[1][0], Array.prototype.slice.call(args[1], 1), override, initiatedOnce];
        } else {
            return [name, args[1], Array.prototype.slice.call(args, 2), override, initiatedOnce];
        }
    }

    React.mixins = {
        /**
         * return the normalized mixins.  there can be N arguments with each argument being
         * - an array: will be flattened out to the parent list of mixins
         * - a string: will match against any registered mixins and append the correct mixin
         * - an object: will be treated as a standard mixin and returned in the list of mixins
         * any string arguments that are provided will cause any dependent mixins to be included
         * in the return list as well
         */
        get: function() {
            var rtn = [],
                index = {},
                initiatedOnce = {};

            get(Array.prototype.slice.call(arguments), index, initiatedOnce, rtn);
            applyInitiatedOnceArgs(initiatedOnce, rtn);
            return rtn;
        },

        /**
         * Inject dependencies that were not originally defined when a mixin was registered
         * @param name {string} the main mixin name
         * @param (any additional) {string} dependencies that should be registered against the mixin
         */
        inject: function(name) {
            var l = _dependsInjected[name];
            if (!l) {
                l = _dependsInjected[name] = [];
            }
            l.push(Array.prototype.slice.call(arguments, 1));
        },

        alias: function(name) {
            addMixin(name, GROUP, Array.prototype.slice.call(arguments, 1), false);
        },

        add: function( /* options, mixin */ ) {
            addMixin.apply(this, mixinParams(arguments, false));
        },

        replace: function( /* options, mixin */ ) {
            addMixin.apply(this, mixinParams(arguments, true));
        },

        exists: function(name) {
            return _mixins[name] || false;
        },

        _reset: function() {
            _dependsOn = {};
            _mixins = {};
            _dependsInjected = {};
            _initiatedOnce = {};
        }
    };

    /**
     * mixin that exposes a "deferUpdate" method which will call forceUpdate after a setTimeout(0) to defer the update.
     * This allows the forceUpdate method to be called multiple times while only executing a render 1 time.  This will
     * also ensure the component is mounted before calling forceUpdate.
     *
     * It is added to mixin manager directly because it serves a purpose that benefits when multiple plugins use it
     */
    React.mixins.add('deferUpdate', {
        getInitialState: function() {
            // ensure that the state exists because we don't want to call setState (which will cause a render)
            return {};
        },
        deferUpdate: function() {
            var state = this.state;
            if (!state._deferUpdate) {
                state._deferUpdate = true;
                var self = this;
                setTimeout(function() {
                    delete state._deferUpdate;
                    if (self.isMounted()) {
                        self.forceUpdate();
                    }
                }, 0);
            }
        }
    });

    /**
     * very simple mixin that ensures that the component state is an object.  This is useful if you
     * know a component will be using state but won't be initialized with a state to prevent a null check on render
     */
    React.mixins.add('state', {
        getInitialState: function() {
            return {};
        },

        componentWillMount: function() {
            // not directly related to this mixin but all of these mixins have this as a dependency
            // if setState was called before the component was mounted, the actual component state was
            // not set because it might not exist.  Convert the pretend state to the real thing
            // (but don't trigger a render)
            var _state = this.__temporary_state;
            if (_state) {
                for (var key in _state) {
                    if (_state.hasOwnProperty(key)) {
                        this.state[key] = _state[key];
                    }
                }
                delete this.__temporary_state;
            }
        }
    });
    React.mixins.setState = setState;
    React.mixins.getState = getState;
    // main body end

});