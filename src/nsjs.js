/**
 * nsjs namespacing library for JavaScript
 * 
 * The objective of this library is to create a standard and reusable way to ensure namespace architecture
 */
(function(exports){
/**
 * @constructor Namespace
 * 
 * @param {String} name
 * @param {Namespace} parent
 */
function Namespace(name, parent){
	if(!/^[a-z0-9_.]+/.test(name)){
		throw new Error('Invalid name provided.' + name);
	}
	this.__name = name;
	this.__parent = parent || exports;
	this.__type = 'Namespace';
	return this;
}
/**
 * @constructor Module
 * 
 * @param {String} name
 * @param {Namespace} parent
 * @param {String} type
 * @param {Any} module
 * 
 * @returns {Module} this
 */
function Module(name, parent, type, module){
	if(!/^[A-Za-z0-9_.]+/.test(name)){
		throw new Error('Invalid name provided.' + name);
	}
	this.__name = name;
	this.__type = type;
	this.__parent = parent || exports;
	this.ns = ns;
	this.load = load;
	this.lock = lock;
	return this;
}
/**
 * @function ns
 * @param name {String}
 */
function ns(name){
	var space,
		_super = this,
		i = 0,
		errors = [];
	name = (name.indexOf('.') > -1)?name.split('.'):[name];
	for(;space = name[i++];){
		if(_super[space] !== undefined){
			var err = new Error(space + ' namespace already defined.');
			errors.push(err);
			_super = _super[space];
			continue;
		}
		_super[space] = new Namespace(space, _super);
		_super = _super[space];
	}
	if(errors.length > 0){
		throw errors;
	}
	return _super;
}
/**
 * @function load
 * 
 * when loading a function as a module the context of this will be the parent object, even if that is a function.
 * watch out for chaining this as the context will become lost if you call this inside the parent function (this);
 * 
 * example:
 * 
 *		ns('test');
 *		test.load('fn', function(x){return x;})
 * 
 * @param name {String}
 * @param module
 * @param last {Boolean}
 */
function load(name, module, immutable){
	var type = detectType(module),
		get,
		set,
		context;
	if(this[name] !== undefined){
		throw new Error('Module already defined.');
	}
/**
 * Function : defaultset
 * 
 * @class load
 * @param value
 */
function defaultset(value){
	module = value;
}
/**
 * Function: defaultget
 * 
 * @class load
 * @returns
 */
function defaultget(){
	var slice = Array.prototype.slice,
		res;
	if(!immutable){
		if(arguments.length === 1){
			set(arguments[0]);
		}			
	}
	res = (typeof module === 'object')?
			(module instanceof Array)?
					slice.call(module, 0): // copy the array
						Object.clone(module): // copy the object
							module; // return the primitive
	if(typeof get === 'function'){
		return get(res);
	}
	return res;
}
/**
 * Function: changeSetter
 * 
 * @class load
 * @param {Function} fn
 */
function changeSetter(fn){
	if(typeof fn === 'function'){
		set = function(value){
			var res = fn(value);
			defaultset(res);
		};
	}
}
/**
 * Function: changeGetter
 * 
 * @class load
 * @param {Function} fn
 */
function changeGetter(fn){
	if(typeof fn === 'function'){
		get = fn;
	}
}
/**
 * finish the load declaration
 */
	set = defaultset;
	defaultget.changeGetter = changeGetter;
	defaultget.changeSetter = changeSetter;

	if(type === 'Property'){
		Module.prototype = Object.create(defaultget);
		this[name] = Module.call(defaultget, name, this, type, defaultget);
	}else{
		Module.prototype = Object.create(module);
		this[name] = (typeof module !== 'function')?new Module(name, this, type, module):Module.call(module, name, this, type, module);
	}
	context = this[name];
	return this[name];
}
/**
 * @function lock
 */
function lock(){
	this.ns = function(){};
	this.load = function(){};
	this.lock = function(){};
}
/**
 * @function detectType
 * @param module
 * @returns type {String}
 */
function detectType(module){
	var type = 'Unknown';
	switch(typeof module){
	case 'string':
	case 'number':
	case 'boolean':
		type = 'Property';
		break;
	case 'object':
		if(module instanceof Array){
			type = 'Collection';
			break;
		}
		type = 'Singleton';
		break;
	case 'function':
		if(module.name && module.name[0] === module.name[0].toUpperCase()){
			type = 'Constructor';
			break;
		}
		type = 'Method';
		break;
	default:
		break;		
	}
	return type;
}
Namespace.prototype = {ns : ns, load : load, lock : lock};
Namespace.prototype.constructor = Namespace;
/**
 * Function: require
 * 
 * returns a module by namespace. This should work in browser and node.
 */
function require(module, retain){
	var path = (module.indexOf('.') > -1)?module.split('.'):[module],
		i = 0, node, node_chain = exports;
	for(;node = path[i++];){
		if(i === path.length){
			if(node_chain[node].__type === 'Method' && retain){
				return makeContextMethod(node_chain[node], node_chain);
			}	
			return node_chain[node];
		}
		node_chain = node_chain[node];
	}
}
/**
 * Function: makeContextMethod
 */
function makeContextMethod(method, context){
	return function(){
		return method.apply(context, arguments);
	};
}
/**
 * global accessors
 */
exports.Namespace = Namespace;
exports.Module = Module;
exports.ns = ns;
exports.load = load;
exports.lock = lock;
exports.require = require;
})((typeof exports !== undefined)? this:exports);