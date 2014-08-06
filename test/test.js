var chai = require('chai'),
    React = require('react'),
    expect = chai.expect,
    mixin1 = {mixin1: true},
    mixin2 = {mixin2: true},
    mixin3 = {mixin3: true},
    mixin4 = {mixin4: true},
    mixinWithParams = function(param1, param2) {
      return {
        param1: param1,
        param2: param2
      };
    };

require('../index')(React);

describe('react-mixin-dependencies', function() {
  beforeEach(function() {
    React.mixins._dependsOn = {};
    React.mixins._mixins = {};
    React.mixins._dependsInjected = {};
    React.mixins._onceInitiated = {};
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
    expect(rtn).to.eql([{param1: 'foo', param2: undefined}]);

    // multiple parameters should be supported as well - all will be converted to strings (and spaces will exist in the arguments)
    rtn = React.mixins.get('p("foo","bar")');
    expect(rtn).to.eql([{param1: 'foo', param2: 'bar'}]);
  });

  it('should include dependencies with parameters references', function() {
    React.mixins.add('1', mixin1);
    React.mixins.add('p', mixinWithParams, '1');
    var rtn = React.mixins.get('p("foo")');
    expect(rtn).to.eql([mixin1, {param1: 'foo', param2: undefined}]);
  });

  it('should support once initiated mixins', function() {
    React.mixins.add({name: 'p', onceInitiated: true}, mixinWithParams);
    var rtn = React.mixins.get('p("foo")', 'p("bar")');
    expect(rtn).to.eql([{param1: 'foo', param2: 'bar'}]);
  });

  it('should support dependencies for once initiated mixins', function() {
    React.mixins.add('mixin1', mixin1);
    React.mixins.add({name: 'p', onceInitiated: true}, mixinWithParams, 'mixin1');
    var rtn = React.mixins.get('p("foo")', 'p("bar")');
    expect(rtn).to.eql([mixin1, {param1: 'foo', param2: 'bar'}]);
  });
});
