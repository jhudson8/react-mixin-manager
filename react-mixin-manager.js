/*!
 * react-mixin-manager v0.8.0
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
    define(['react'], main);
  } else if (typeof exports !== 'undefined' && typeof require !== 'undefined') {
    module.exports = function(React) {
      main(React);
    };
  } else {
    main(React);
  }
})(function(React) {

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
          params = eval('[' + params + ']');
        }
        var mixin = React.mixins._mixins[name],
            checkAgain = false,
            skip = false;

        if (mixin) {
          if (typeof mixin === 'function') {
            if (React.mixins._initiatedOnce[name]){
              initiatedOnce[name] = (initiatedOnce[name] || []);
              initiatedOnce[name].push(params);
              skip = true;
            } else {
              mixin = mixin.apply(this, params || []);
              checkAgain = true;
            }
          } else if (params) {
            throw new Error('the mixin "' + name + '" does not support parameters');
          }
          get(React.mixins._dependsOn[name], index, initiatedOnce, rtn);
          get(React.mixins._dependsInjected[name], index, initiatedOnce, rtn);

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
          // just add the mixin normally
          rtn.push(mixin);
        }
      }
    }

    if (Array.isArray(values)) {
      for (var i=0; i<values.length; i++) {
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
  function getInitiatedOnce(mixins, rtn) {

    /**
      * added once initiated mixins to return array
      */
    function addInitiatedOnce(mixin, params){
      mixin = mixin.apply(this, params || []);
        rtn.push(mixin);
      }

      for (var m in mixins){
        if (mixins.hasOwnProperty(m)){
          addInitiatedOnce(React.mixins._mixins[m], mixins[m]);
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
    var mixins = React.mixins;
    if (!override && mixins._mixins[name]) {
      return;
    }
    mixins._dependsOn[name] = depends.length && depends;
    mixins._mixins[name] = mixin;

    if (initiatedOnce){
      mixins._initiatedOnce[name] = true;
    }
  }

  function GROUP() {
    // empty function which is used only as a placeholder to list dependencies
  }

  function mixinParams(args, override) {
    var name,
        options = args[0],
        initiatedOnce = false;

    if (typeof(options) === 'object'){
      name = options.name;
      initiatedOnce = options.initiatedOnce;
    } else {
      name = options;
    }

    if (!name || !name.length){
        throw new Error('the mixin name hasn\'t been specified');
    }

    if (Array.isArray(args[1])) {
      return [name, args[1][0], Array.prototype.slice.call(args[1], 1), override, initiatedOnce];
    } else {
      return [name, args[1], Array.prototype.slice.call(args, 2), override, initiatedOnce]
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
      getInitiatedOnce(initiatedOnce, rtn);
      return rtn;
    },

    /**
     * Inject dependencies that were not originally defined when a mixin was registered
     * @param name {string} the main mixin name
     * @param (any additional) {string} dependencies that should be registered against the mixin
     */
    inject: function(name) {
      var l = this._dependsInjected[name];
      if (!l) {
        l = this._dependsInjected[name] = [];
      }
      l.push(Array.prototype.slice.call(arguments, 1));
    },

    alias: function(name) {
      addMixin(name, GROUP, Array.prototype.slice.call(arguments, 1), false);
    },

    add: function(options, mixin) {
      addMixin.apply(this, mixinParams(arguments, false));
    },

    replace: function(options, mixin) {
      addMixin.apply(this, mixinParams(arguments, true));
    },

    exists: function(name) {
      return this._mixins[name] || false;
    },

    _dependsOn: {},
    _dependsInjected: {},
    _mixins: {},
    _initiatedOnce: {}
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
    }
  });
});
