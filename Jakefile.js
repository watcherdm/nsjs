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
 * build
 */
task('build', ['clean'], function(){
	sys.puts('linting');
	exec('jslint src/nsjs.js', function(error, stdout, stderr){
		sys.puts('lint results: ' + stdout);
	});
	exec('mkdir bin');
	exec('cp src/nsjs.js bin');
	// add closure compiler support
});
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
	exec('dox --title "' + title + '" src/nsjs.js > docs/index.html');
});