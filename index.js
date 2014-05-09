// commonjs impl for react-mixin-dependencies
module.exports = function(React) {

  /**
   * return the normalized mixin list
   * @param values {Array} list of mixin entries
   * @param index {Object} hash which contains a truthy value for all named mixins that have been added
   * @param rtn {Array} the normalized return array
   */
  function get(values, index, rtn) {

    /**
     * add the named mixin and all un-added dependencies to the return array
     * @param the mixin name
     */
    function addTo(name) {
      if (!index[name]) {
        var mixin = React.mixins._mixins[name];
        if (mixin) {
          var depends = React.mixins._dependsOn[name];
          if (depends) {
            for (var i=0; i<depends.length; i++) {
              addTo(depends[i]);
            }
          }
          rtn.push(mixin);
          index[name] = true;
        } else {
          throw "invalid mixin '" + name + "'";
        }
      }
    }

    for (var i=0; i<values.length; i++) {
      var mixin = values[i];
      if (mixin) {
        if (Array.isArray(mixin)) {
          // flatten it out
          get(mixin, index, rtn);
        } else if (typeof mixin === 'string') {
          // add the named mixin and all of it's dependencies
          addTo(mixin);
        } else {
          // just add the mixin normally
          rtn.push(mixin);
        }
      }
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
          index = {};
      get(Array.prototype.slice.call(arguments), index, rtn);
      return rtn;
    },

    add: function(name, mixin) {
      var depends = Array.prototype.slice.call(arguments, 2);
      React.mixins._dependsOn[name] = depends.length && depends;
      React.mixins._mixins[name] = mixin;
    },

    _dependsOn: {},
    _mixins: {}
  };
};
