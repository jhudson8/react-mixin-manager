var fs = require('fs'),
    UglifyJS = require('uglify-js');

var version = JSON.parse(fs.readFileSync('./package.json', {encoding: 'utf-8'})).version;

var minimized = UglifyJS.minify('./react-mixin-manager.js');
var minimizedHeader = '/*!\n * react-mixin-manager v' + version + ';  MIT license\n */\n';
fs.writeFileSync('./react-mixin-manager.min.js', minimizedHeader + minimized.code, {encoding: 'utf8'});
