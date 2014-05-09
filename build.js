var fs = require('fs');

function wrap(wrapperFile, contents) {
  var wrapper = fs.readFileSync('./lib/' + wrapperFile + '.wrapper', {encoding: 'utf8'});
  var parts = wrapper.split('{core}');
  return parts[0] + contents + parts[1];
}

function write(outfile, wrapper, contents) {
  fs.writeFileSync('./' + outfile + '.js', wrap(wrapper, contents), {encoding: 'utf8'});  
}

var contents = fs.readFileSync('./lib/core.js', {encoding: 'utf8'});
write('react-mixin-dependencies-amd', 'amd', contents);
write('react-mixin-dependencies', 'global', contents);
write('index', 'commonjs', contents);
