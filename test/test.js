var chai = require('chai'),
    expect = chai.expect,
    reactMixinDependencies = require('../index'),
    mixin1 = {type: 1},
    mixin2 = {type: 2},
    mixin3 = {type: 3},
    mixin4 = {type: 4};

describe('react-mixin-dependencies', function() {
  var toTest, mixins;
  beforeEach(function() {
    toTest = {};
    reactMixinDependencies(toTest);
    mixins = toTest.mixins;
  });

  it('should return standard mixins', function() {
    var rtn = mixins.get(mixin1, mixin2);
    expect(rtn).to.eql([mixin1, mixin2]);
  });

  it('should return named mixins', function() {
    mixins.add('1', mixin1);
    rtn = mixins.get('1', mixin2);
    expect(rtn).to.eql([mixin1, mixin2]);
  });

  it('should return named mixins and dependencies', function() {
    mixins.add('1', mixin1);
    mixins.add('2', mixin2, '1');
    rtn = mixins.get('2');
    expect(rtn).to.eql([mixin1, mixin2]);
  });

  it('should return named n-level dependencies and not duplicate', function() {
    mixins.add('1', mixin1);
    mixins.add('2', mixin2, '1');
    mixins.add('3', mixin3, '1', '2');
    mixins.add('4', mixin4, '1', '3');
    rtn = mixins.get('4', '2');
    expect(rtn).to.eql([mixin1, mixin2, mixin3, mixin4]);
  });

  it('should extract list arguments', function() {
    mixins.add('1', mixin1);
    mixins.add('2', mixin2);
    mixins.add('3', mixin3);
    mixins.add('4', mixin4);
    rtn = mixins.get('1', ['2', '3']);
    expect(rtn).to.eql([mixin1, mixin2, mixin3]);
  });

});
