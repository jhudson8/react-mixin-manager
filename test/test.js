var chai = require('chai'),
    React = require('react'),
    expect = chai.expect,
    mixin1 = {mixin1: true},
    mixin2 = {mixin2: true},
    mixin3 = {mixin3: true},
    mixin4 = {mixin4: true};

require('../index')(React);

describe('react-mixin-dependencies', function() {
  beforeEach(function() {
    React.mixins._dependsOn = {};
    React.mixins._mixins = {};
  });

  it('should return standard mixins', function() {
    var rtn = React.mixins.get(mixin1, mixin2);
    expect(rtn).to.eql([mixin1, mixin2]);
  });

  it('should return named mixins', function() {
    React.mixins.add('1', mixin1);
    rtn = React.mixins.get('1', mixin2);
    expect(rtn).to.eql([mixin1, mixin2]);
  });

  it('should return named mixins and dependencies', function() {
    React.mixins.add('1', mixin1);
    React.mixins.add('2', mixin2, '1');
    rtn = React.mixins.get('2');
    expect(rtn).to.eql([mixin1, mixin2]);
  });

  it('should return named n-level dependencies and not duplicate', function() {
    React.mixins.add('1', mixin1);
    React.mixins.add('2', mixin2, '1');
    React.mixins.add('3', mixin3, '1', '2');
    React.mixins.add('4', mixin4, '1', '3');
    rtn = React.mixins.get('4', '2');
    expect(rtn).to.eql([mixin1, mixin2, mixin3, mixin4]);
  });

  it('should extract list arguments', function() {
    React.mixins.add('1', mixin1);
    React.mixins.add('2', mixin2);
    React.mixins.add('3', mixin3);
    React.mixins.add('4', mixin4);
    rtn = React.mixins.get('1', ['2', '3']);
    expect(rtn).to.eql([mixin1, mixin2, mixin3]);
  });

  it('should replace existing mixins', function() {
    React.mixins.add('1', mixin1);
    React.mixins.replace('1', mixin2);
    rtn = React.mixins.get('1');
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
    rtn = React.mixins.get('1');
    expect(rtn).to.eql([mixin2, mixin1]);
  });
});
