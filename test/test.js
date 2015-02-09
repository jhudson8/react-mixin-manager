/*global global, require */
var sinon = require('sinon'),
  chai = require('chai'),
  React = require('react'),
  expect = chai.expect,
  _ = require('underscore'),
  mixin1 = {
    mixin1: true
  },
  mixin2 = {
    mixin2: true
  },
  mixin3 = {
    mixin3: true
  },
  mixin4 = {
    mixin4: true
  },
  mixinWithParams = function(param1, param2) {
    return {
      param1: param1,
      param2: param2
    };
  },
  initiatedOnceMixinWithParams = function(calls) {
    return {
      calls: calls
    };
  };

var jsdom = require('jsdom');
 
// move into beforeEach and flip global.window.close on to improve
// cleaning of environment during each test and prevent memory leaks
global.document = jsdom.jsdom('<html><body><div id="test"></div></body></html>', jsdom.level(1, 'core'));
global.window = document.parentWindow;

require('../index')(React);

describe('#getState / #setState', function() {
  it('should get and state before component is initialized', function(done) {
    var childMixin = {
      getInitialState: function() {
        React.mixins.setState({foo: 'bar'}, this);
        expect(this.__temporary_state.foo).to.eql('bar');
        return null;
      }
    };
    var Component = React.createFactory(React.createClass({
      mixins: ['state', childMixin],
      render: function() {
        expect(this.state.foo).to.eql('bar');
        done();
        return React.createElement('div');
      }
    }));
    React.render(new Component(), document.getElementById('test'));
  });
});

describe('react-mixin-dependencies', function() {
  beforeEach(function() {
    React.mixins._reset();
  });

  it('should return standard mixins', function() {
    var rtn = React.mixins.get(mixin1, mixin2);
    expect(rtn).to.eql([mixin1, mixin2]);
  });

  it('should return named mixins', function() {
    React.mixins.add('1', mixin1);
    var rtn = React.mixins.get('1', mixin2);
    expect(rtn).to.eql([mixin1, mixin2]);
  });

  it('should return named mixins and dependencies', function() {
    React.mixins.add('1', mixin1);
    React.mixins.add('2', mixin2, '1');
    var rtn = React.mixins.get('2');
    expect(rtn).to.eql([mixin1, mixin2]);
  });

  it('should be able to register an array with first element as mixin and all others as dependencies', function() {
    React.mixins.add('1', mixin1);
    React.mixins.add('2', [mixin2, '1']);
    var rtn = React.mixins.get('2');
    expect(rtn).to.eql([mixin1, mixin2]);
  });

  it('should return named n-level dependencies and not duplicate', function() {
    React.mixins.add('1', mixin1);
    React.mixins.add('2', mixin2, '1');
    React.mixins.add('3', mixin3, '1', '2');
    React.mixins.add('4', mixin4, '1', '3');
    var rtn = React.mixins.get('4', '2');
    expect(rtn).to.eql([mixin1, mixin2, mixin3, mixin4]);
  });

  it('should extract list arguments', function() {
    React.mixins.add('1', mixin1);
    React.mixins.add('2', mixin2);
    React.mixins.add('3', mixin3);
    React.mixins.add('4', mixin4);
    var rtn = React.mixins.get('1', ['2', '3']);
    expect(rtn).to.eql([mixin1, mixin2, mixin3]);
  });

  it('should replace existing mixins', function() {
    React.mixins.add('1', mixin1);
    React.mixins.replace('1', mixin2);
    var rtn = React.mixins.get('1');
    expect(rtn).to.eql([mixin2]);
  });

  it('should use "exists" to tell if a mixin has already been registered', function() {
    React.mixins.add('1', mixin1);
    expect(!!React.mixins.exists('1')).to.eql(true);
    expect(React.mixins.exists('2')).to.eql(false);
  });

  it('should allow secondary dependencies (dependsOn)', function() {
    // secondary dependencies do not need the related mixins to be defined
    React.mixins.inject('1', '2');
    React.mixins.add('1', mixin1);
    React.mixins.add('2', mixin2);
    var rtn = React.mixins.get('1');
    expect(rtn).to.eql([mixin2, mixin1]);
  });

  it('should support parameters in mixin references', function() {
    React.mixins.add('p', mixinWithParams);
    var rtn = React.mixins.get('p("foo")');
    expect(rtn).to.eql([{
      param1: 'foo',
      param2: undefined
    }]);

    // multiple parameters should be supported as well - all will be converted to strings (and spaces will exist in the arguments)
    rtn = React.mixins.get('p("foo","bar")');
    expect(rtn).to.eql([{
      param1: 'foo',
      param2: 'bar'
    }]);
  });

  it('should include dependencies with parameters references', function() {
    React.mixins.add('1', mixin1);
    React.mixins.add('p', mixinWithParams, '1');
    var rtn = React.mixins.get('p("foo")');
    expect(rtn).to.eql([mixin1, {
      param1: 'foo',
      param2: undefined
    }]);
  });

  it('should support once initiated mixins', function() {
    React.mixins.add({
      name: 'p',
      initiatedOnce: true
    }, initiatedOnceMixinWithParams);
    var rtn = React.mixins.get('p("foo")', 'p("bar")');
    expect(rtn).to.eql([{
      calls: [['foo'], ['bar']]
    }]);
  });

  it('should support dependencies for once initiated mixins', function() {
    React.mixins.add('mixin1', mixin1);
    React.mixins.add({
      name: 'p',
      initiatedOnce: true
    }, initiatedOnceMixinWithParams, 'mixin1');
    var rtn = React.mixins.get('p("foo")', 'p("bar")');
    expect(rtn).to.eql([mixin1, {
      calls: [['foo'], ['bar']]
    }]);
  });

  it('should support replace for once initiated mixins', function() {
    React.mixins.add({
      name: 'p',
      initiatedOnce: true
    }, mixin1);
    React.mixins.replace({
      name: 'p',
      initiatedOnce: true
    }, initiatedOnceMixinWithParams);
    var rtn = React.mixins.get('p("foo", "test")', 'p("bar")');
    expect(rtn).to.eql([{
      calls: [['foo', 'test'], ['bar']]
    }]);
  });

  it('should flatten the arguments for once initiated mixin', function() {
    var wrappedMixinImpl = function() {
      var params = Array.prototype.slice.call(arguments, 0);
      var flattenParams = _.flatten(params);
      return mixinWithParams.apply(this, flattenParams);
    };
    React.mixins.replace({
      name: 'p',
      initiatedOnce: true
    }, wrappedMixinImpl);
    var rtn = React.mixins.get('p("foo")', 'p("bar")');
    expect(rtn).to.eql([{
      param1: 'foo',
      param2: 'bar'
    }]);
  });

  it('should reuse dependant mixins even if they are called with parameters using initiatedOnce (and keep them in the right order)', function() {
    var initiatedOnce = function(argsArr) {
      return {
        argsArr: function() {
          return argsArr;
        }
      };
    };
    React.mixins.add({name: 'once', initiatedOnce: true}, initiatedOnce);
    var depOn = {
      test: function() {}
    };
    React.mixins.add('depOn', depOn, 'once');

    var rtn = React.mixins.get(['depOn', 'once("foo")']);
    expect(rtn.length).to.eql(2);

    var argsArr = rtn[0].argsArr();
    expect(argsArr).to.eql([['foo']]);
  });

  it('should add "mixins" attribute as dependencies from a provided mixin', function() {
    React.mixins.add('1', mixin1);
    React.mixins.add('2', mixin2);
    var testMixin = {
      mixins: ['1'],
      foo: 'bar'
    };
    var rtn = React.mixins.get('2', testMixin);
    expect(rtn.length).to.eql(3);
    expect(rtn[0]).to.eql(mixin2);
    expect(rtn[1]).to.eql(mixin1);
    // the mixin should be cloned so the mixins attribute can be removed
    expect(rtn[2]).to.not.eql(testMixin);
    expect(rtn[2]).to.eql({foo: 'bar'});
  });

  describe('#deferUpdate', function() {
    var self;
    beforeEach(function() {
      React.mixins.defaultDeferUpdateInterval = 100;
      this.clock = sinon.useFakeTimers();
      self = {
        isMounted: function() { return true; },
        forceUpdate: sinon.spy(),
        state: {}
      };
    });
    afterEach(function() {
      this.clock.restore();
    });

    var mixin = {
      // placeholder to have something to register
    };
    it('should default to 100ms', function() {
      React.mixins.add('deferTest', mixin, 'deferUpdate');
      var deferMixin = React.mixins.get('deferTest')[0];
      deferMixin.deferUpdate.call(self);
      this.clock.tick(99);
      expect(self.forceUpdate.callCount).to.eql(0);
      this.clock.tick(1);
      expect(self.forceUpdate.callCount).to.eql(1);
      expect(self.state._deferUpdateTimer).to.eql(undefined);
    });
    it('should cancel if another force update occurs', function() {
      React.mixins.add('deferTest', mixin, 'deferUpdate');
      var deferMixin = React.mixins.get('deferTest')[0];
      deferMixin.deferUpdate.call(self);
      deferMixin.componentDidUpdate.call(self);
      expect(self.state._deferUpdateTimer).to.eql(undefined);
      this.clock.tick(101);
      expect(self.forceUpdate.callCount).to.eql(0);
    });
    it('should prevent rendering if an update timer has been set', function() {
      React.mixins.add('deferTest', mixin, 'deferUpdate');
      var deferMixin = React.mixins.get('deferTest')[0];
      deferMixin.deferUpdate.call(self);
      var rtn = deferMixin.shouldComponentUpdate.call(self);
      expect(rtn).to.eql(false);
    });
    it('should only render once if multiple deferUpdates are called', function() {
      React.mixins.add('deferTest', mixin, 'deferUpdate');
      var deferMixin = React.mixins.get('deferTest')[0];
      deferMixin.deferUpdate.call(self);
      deferMixin.deferUpdate.call(self);
      this.clock.tick(99);
      expect(self.forceUpdate.callCount).to.eql(0);
      this.clock.tick(1);
      expect(self.forceUpdate.callCount).to.eql(1);
      expect(self.state._deferUpdateTimer).to.eql(undefined);
    });
    it('should update timer if a later deferUpdate is called', function() {
      React.mixins.add('deferTest', mixin, 'deferUpdate');
      var deferMixin = React.mixins.get('deferTest')[0];
      deferMixin.deferUpdate.call(self);
      this.clock.tick(50);
      deferMixin.deferUpdate.call(self);
      this.clock.tick(51);
      expect(self.forceUpdate.callCount).to.eql(0);
      this.clock.tick(50);
      expect(self.forceUpdate.callCount).to.eql(1);
      expect(self.state._deferUpdateTimer).to.eql(undefined);
    });
    it('should execute directly if default interval is < 0', function() {
      React.mixins.defaultDeferUpdateInterval = -1;
      React.mixins.add('deferTest', mixin, 'deferUpdate');
      var deferMixin = React.mixins.get('deferTest')[0];
      deferMixin.deferUpdate.call(self);
      expect(self.forceUpdate.callCount).to.eql(1);
    });
  });
});
