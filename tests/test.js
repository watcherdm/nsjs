/**
 * nsjs tests
 */
(function(exports){
var assert = require('assert'),
	tests = [];
function setup(nsjs){
	nsjs.ns('test');
	nsjs.ns('a.b.c.d');
	nsjs.load('e', {a : true});
	nsjs.load('f', function(x){return x * x;});
	nsjs.load('g', 1);
	nsjs.load('h', 'Hello World');
}
function runTests(context){
	setup(context);
	var i = 0,
		test;
	for(; test = tests[i++];){
		try{
			test.fn(context);
			console.log(test.name + ': Passed');
		}catch(e){
			var j = 0,
				err;
			if(e instanceof Array){
				for(;err = e[j++];){
					console.error(test.name + ': Error :: ' + err.name + ' ' + err.message);
				}
				continue;
			}
			if(e.name === 'AssertionError'){
				console.error(test.name + ': Failed :: ' + e.name + ' ' + e.message);
				continue;
			}
			console.error(test.name + ': Error :: ' + e.name + ' ' + e.message);
		}
	}
	tearDown(context);
}
function addTest(fn){
	tests.push({name : fn.name, fn: fn});
}
function testNamespaceCreate(ns){
	assert.ok(ns.hasOwnProperty('test'), 'The test namespace was not created!');
}
addTest(testNamespaceCreate);
function testNamespaceDuplicationError(ns){
	try{
		ns.ns('test');
	}catch(e){
		if(e instanceof Array){
			var i = 0,
				err;
			for(;err = e[i++];){
				assert.throws(function(){throw err;}, Error, 'did not throw Namespace exists error.');
			}
		}
	}
}
addTest(testNamespaceDuplicationError);
function testNamespaceType(ns){	
	assert.strictEqual(ns.a.__type, 'Namespace', 'Incorrect __type property set.');
}
addTest(testNamespaceType);
function testNamespaceDeep(ns){
	assert.ok(ns.a.b.c.hasOwnProperty('d'), 'The deep a.b.c.d namespace was not created!');
}
addTest(testNamespaceDeep);
function testNamespaceDeepDuplicationError(ns){
	try{
		ns.a.ns('b.c');
	}catch(e){
		if(e instanceof Array){
			var i = 0,
				err;
			for(;err = e[i++];){
				assert.throws(function(){throw err;}, Error, 'did not throw Namespace exists error.');
			}
		}
	}
}
addTest(testNamespaceDeepDuplicationError);
function testModuleLoaded(ns){
	assert.ok(ns.hasOwnProperty('e'), 'The e module was not loaded!');	
}
addTest(testModuleLoaded);
function testMethodLoaded(ns){
	assert.ok(ns.hasOwnProperty('f'), 'The f method was not loaded!');
}
addTest(testMethodLoaded);
function testNumberPropertyLoaded(ns){
	assert.ok(ns.hasOwnProperty('g'), 'The g property was not loaded!');
	assert.strictEqual(typeof ns.g(), 'number', 'Value of ns.g was not numeric');
}
addTest(testNumberPropertyLoaded);
function testStringPropertyLoaded(ns){
	assert.ok(ns.hasOwnProperty('h'), 'The h property was not loaded!');
	assert.strictEqual(typeof ns.h(), 'string', 'Value of ns.h was not a string');
}
addTest(testStringPropertyLoaded);
function tearDown(nsjs){
	delete nsjs.test;
	delete nsjs.a;
	delete nsjs.e;
	delete nsjs.f;
	delete nsjs.g;
	delete nsjs.h;
}
exports.runTests = runTests;
})((typeof exports !== undefined)?exports:window);