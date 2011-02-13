/**
 * nsjs tests
 * 
 * @param exports
 */
(function(exports){
var assert = require('assert'),
	tests = [];
/**
 * Function: setup
 * 
 * @param nsjs
 */
function setup(nsjs){
	nsjs.ns('namespace'); // namespace
	nsjs.ns('deep.namespace'); // deep namespace
	nsjs.load('singleton', {a : true}); // singleton
	nsjs.load('method', function(x){return x * x;}); // method
	nsjs.load('Constructor', function Test(){this.y = true;}); // constructor
	nsjs.load('number', 1); // numeric property
	nsjs.load('string', 'Hello World'); // string property
	nsjs.load('boolean', true); // boolean property
}
/**
 * Function: runTests
 * 
 * @param context
 */
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
/**
 * Function: addTest
 * 
 * @param fn
 */
function addTest(fn){
	tests.push({name : fn.name, fn: fn});
}
/**
 * Function: testNamespaceCreate
 * 
 * @param ns
 */
function testNamespaceCreate(ns){
	assert.ok(ns.hasOwnProperty('namespace'), 'The test namespace was not created!');
	assert.ok(ns.namespace instanceof ns.Namespace, 'The namespace isn\'t  of the appropriate type!');
}
addTest(testNamespaceCreate);
/**
 * Function: testNamespaceDuplicationError
 */
function testNamespaceDuplicationError(ns){
	try{
		ns.ns('namespace');
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
/**
 * Function: testNamespaceType
 */
function testNamespaceType(ns){	
	assert.strictEqual(ns.namespace.__type, 'Namespace', 'Incorrect __type property set.');
}
addTest(testNamespaceType);
/**
 * Function: testNamespaceDeep
 */
function testNamespaceDeep(ns){
	assert.ok(ns.deep.hasOwnProperty('namespace'), 'The deep.namespace was not created!');
}
addTest(testNamespaceDeep);
/**
 * Function: testNamespaceDeepDuplicationError
 */
function testNamespaceDeepDuplicationError(ns){
	try{
		ns.ns('deep.namespace.test');
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
/**
 * Function: testModuleLoaded
 */
function testModuleLoaded(ns){
	assert.ok(ns.hasOwnProperty('singleton'), 'The singleton module was not loaded!');
	assert.ok(ns.singleton.__type === 'Singleton', 'The singleton module does not have the appropriate __type property');
}
addTest(testModuleLoaded);
/**
 * Function: testMethodLoaded
 */
function testMethodLoaded(ns){
	assert.ok(ns.hasOwnProperty('method'), 'The f method was not loaded!');
	assert.ok(ns.method.__type === 'Method', 'The method has the wrong __type property.');
}
addTest(testMethodLoaded);
/**
 * Function: testNumberPropertyLoaded
 */
function testNumberPropertyLoaded(ns){
	assert.ok(ns.hasOwnProperty('number'), 'The number property was not loaded!');
	assert.strictEqual(typeof ns.number(), 'number', 'Value of ns.number was not numeric');
}
addTest(testNumberPropertyLoaded);
/**
 * Function: testStringPropertyLoaded
 */
function testStringPropertyLoaded(ns){
	assert.ok(ns.hasOwnProperty('string'), 'The string property was not loaded!');
	assert.strictEqual(typeof ns.string(), 'string', 'Value of ns.string was not a string');
}
addTest(testStringPropertyLoaded);
/**
 * Function: testBooleanPropertyLoaded
 */
function testBooleanPropertyLoaded(ns){
	assert.ok(ns.boolean() === true, 'Value of boolean property was not true');
	ns.boolean(false);
	assert.ok(ns.boolean() === false, 'Value of boolean did not change to false');
}
addTest(testBooleanPropertyLoaded);
/**
 * Function: testModifySetter
 * 
 * XXX not implemented
 */
function testModifySetter(ns){
	
}
/**
 * Function: testConstructor
 */
function testConstructor(ns){
	assert.ok(typeof ns.Constructor === 'function', 'Constructor module is not a funtion.');
	var testObj = new ns.Constructor();
	assert.ok(testObj.y, 'The object create from the Constructor module did not contain the right properties.');
	assert.ok(testObj instanceof ns.Constructor, 'Object create from the Constructor is not an instance of Constructor');
	assert.strictEqual(ns.Constructor.__type, 'Constructor', '__type property was not set properly.');
}
addTest(testConstructor);
/**
 * Function: tearDown
 */
function tearDown(nsjs){
	delete nsjs.namespace;
	delete nsjs.deep;
	delete nsjs.singleton;
	delete nsjs.method;
	delete nsjs.Constructor;
	delete nsjs.number;
	delete nsjs.string;
	delete nsjs.boolean;
}
exports.runTests = runTests;
})((typeof exports !== undefined)?exports:window);