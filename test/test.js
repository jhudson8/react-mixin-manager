var chai = require('chai'),
    expect = chai.expect,
    reactMixinDependencies = require('../index'),
    mixin1 = {type: 1},
    mixin2 = {type: 2},
    mixin3 = {type: 3},
    mixin4 = {type: 4};

describe('react-mixin-dependencies', function() {
  var React;
  beforeEach(function() {
    React = {};
    reactMixinDependencies(React);
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

});
