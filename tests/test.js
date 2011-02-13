/**
 * nsjs tests
 * 
 * @param exports
 */
(function(exports){
function repeat(c, n){
	var res = '';
	while(n--){
		res += c;
	}
	return res;
}
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
	nsjs.ns('math'); // begin a math namespace for testing some ideas
	nsjs.math.load('add', function(x, y){ return x + y;});
	nsjs.math.load('mul', function(x, y){ var prod = 0; while(y--){prod = this.add(prod, x);} return prod;});
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
			console.log(test.name + repeat(' ', (50 - test.name.length)) + ': Passed');
		}catch(e){
			var j = 0,
				err;
			if(e instanceof Array){
				for(;err = e[j++];){
					console.error(test.name + repeat(' ', (50 - test.name.length)) + ': Error :: ' + err.name + ' ' + err.message);
				}
				continue;
			}
			if(e.name === 'AssertionError'){
				console.error(test.name + repeat(' ', (50 - test.name.length)) + ': Failed :: ' + e.name + ' ' + e.message);
				continue;
			}
			console.error(test.name + repeat(' ', (50 - test.name.length)) +  ': Error :: ' + e.name + ' ' + e.message);
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
				err,
				fn = function(err_i){return function(){throw err_i;};};
			for(;err = e[i++];){
				assert.throws(fn(err), Error, 'did not throw Namespace exists error.');
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
				err,
				fn = function(err_i){return function(){throw err_i;};};
			for(;err = e[i++];){
				assert.throws(fn(err), Error, 'did not throw Namespace exists error.');
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
 * Function: testChangeSetter 
 */
function testChangeSetter(ns){
	ns.number.changeSetter(function(x){
		return parseFloat(x).toFixed(2);
	});
	ns.number(10);
	assert.strictEqual(ns.number(), '10.00', 'Setter did not appropriately affect the internal value.');
}
addTest(testChangeSetter);
/**
 * Function: testChangeGetter
 */
function testChangeGetter(ns){
	ns.string.changeGetter(function(x){
		return (x.toLowerCase().replace(/\s/g, '') === x.toLowerCase().replace(/\s/g, '').split('').reverse().join(''))?x + ' is a palindrome': x + ' is not a palindrome';
	});
	ns.string('Was it a rat I saw');
	assert.ok(ns.string().indexOf('palindrome') > -1, 'The getter did not change the result.');
}
addTest(testChangeGetter);
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
 * Function: testRequire
 */
function testRequire(ns){
	var add = ns.require('math.add');
	assert.ok(typeof add === 'function', 'Returned something that was not the function I require.');
}
addTest(testRequire);
/**
 * Function: testRequireRetain
 */
function testRequireRetain(ns){
	var mul = ns.require('math.mul', true);
	assert.ok(typeof mul === 'function', 'Returned something that was not the function I require.');
	assert.strictEqual(mul(9, 9), 81, 'Something went wrong with the multiplication function. Got result :: ' + mul(9, 9));
}
addTest(testRequireRetain);
/**
 * Function: testExtendModule
 */
function testExtendModule(ns){
	ns.singleton.load('n', 10);
	ns.singleton.load('s', 'Hello');
	ns.singleton.ns('test');
	ns.singleton.load('fn', function(){return this.__name;});
	assert.ok(ns.singleton.n.__type === 'Property', 'Invalid type on module property.');
	assert.ok(ns.singleton.s() === 'Hello', 'Invalid value on module property');
	assert.ok(ns.singleton.test.__type === 'Namespace', 'Namespace test not loaded onto module.');
	assert.ok(ns.singleton.fn.__type === 'Method', 'Method not loaded onto module.');
	assert.ok(ns.singleton.fn() === 'singleton', 'Context was not retained in loaded method.');
}
addTest(testExtendModule);
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