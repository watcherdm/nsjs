/**
 * Jakefile for nsjs. 
 */
/**
 * dependencies
 */
var sys = require('sys'),
	util = require('util'),
	exec = require('child_process').exec,
/**
 * project variables
 */
	title = "NSJS Namespacing and Module Loading Library",
	version = '0.1',
	name = 'ICARUS';
/**
 * default
 */
task('default',['build', 'docs'],function(){
	sys.puts('NSJS BUILD SYSTEM');
});
/**
 * tests
 */
task('test', [], function(){
	var ns = require('./src/nsjs');
	var tests = require('./tests/test');
	tests.runTests(ns);
	complete();
}, true);
/**
 * build
 */
task('build', ['test','clean'], function(){
	sys.puts('linting');
	exec('jslint src/nsjs.js', function(error, stdout, stderr){
		sys.puts('lint results: ' + stdout);
	});
	exec('mkdir bin', function(){
		exec('java -jar tools/compiler.jar --js src/nsjs.js --js_output_file bin/nsjs.min.js', function(){
			complete();
		});	
	});
	// add closure compiler support
}, true);
/**
 * clean
 */
task('clean', [], function(){
	exec('rm -rf bin', function(){
		exec('rm -rf docs', function(){
			complete();
		});
	});
	// remove bin output folder contents and docs
}, true);
/**
 * docs
 */
task('docs', [], function(){
	sys.puts('writing docs');
	exec('mkdir docs');
	exec('dox --title "' + title + '" src/nsjs.js tests/test.js > docs/index.html');
});