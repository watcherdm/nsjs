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
	this.__name = name;
	this.__type = type;
	this.__parent = parent || exports;
	this.ns = ns;
	this.load = load;
	return this;
}
/**
 * @function ns
 * @param name {String}
 * @param last {Boolean}
 */
function ns(name, last){
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
	if(last){
		this.ns = function(){
			throw new Error('Namespace method already finalized. No more namespaces can be loaded in this namespace');
		};
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
function load(name, module, last){
	var type = detectType(module);
	if(this[name] !== undefined){
		throw new Error('Module already defined.');
	}
	if(type === 'Property'){
		this[name] = module;
	}else{
		Module.prototype = Object.create(module);
		this[name] = (typeof module !== 'function')?new Module(name, this, type, module):Module.call(module, name, this, type, module);			
	}
	if(last){
		this.load = function(){
			throw new Error('Load method already finalized. No more modules can be loaded in this namespace');
		};
	}
	return this[name];
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
Namespace.prototype = {ns : ns, load : load};
Namespace.prototype.constructor = Namespace;
/**
 * global accessors
 */
exports.Namespace = Namespace;
exports.Module = Module;
exports.ns = ns;
exports.load = load;

})((typeof exports !== undefined)? this:exports);