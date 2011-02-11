/**
 * nsjs namespacing library for JavaScript
 * 
 * The objective of this library is to create a standard and reusable way to ensure namespace architecture
 */

(function(exports){
/**
 * @constructor Namespace
 */
	function Namespace(name, parent){
		// just the basics for now
		this.__name = name;
		this.__parent = parent || global;
		this.__type = 'Namespace';
		// add some method stubs
		this.__ns = function(name, last){
			ns.call(this,name);
			if(last){
				this.__ns = function(){};
			}
		};
		this.__load = load;
	}
/**
 * @constructor Module
 */
	function Module(name, parent, module){
		// basic data
		this.__name = name;
		this.__type = detectType(module); // glean as much as we can from the module
		this.__parent = parent;
		// helpers and module methods
		this.__ns = function(name, last){
			ns.call(this, name);
			if(last){
				this.__ns = function(){};
			}
		};
		this.__load = load;
		return this;
	}
/**
 * @function ns
 * @param name {String}
 * @param last {Boolean}
 */
	function ns(name, last){
		console.log(this);
		if(this[name] !== undefined){
			throw new Error('Namespace already defined.');
		}
		this[name] = new Namespace(name, this);
		if(last){
			this.__ns = function(){
				throw new Error('Namespace method already finalized. No more namespaces can be loaded in this namespace');
			};
		}
	}
/**
 * @function load
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
			this[name] = (typeof module !== 'function')?new Module(name, this, module):Module.call(module, name, this, module);			
		}
		if(last){
			this.__load = function(){
				throw new Error('Load method already finalized. No more modules can be loaded in this namespace');
			};
		}
	}
/**
 * @function detectType
 * @param module
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
			// is it an array?
			if(module instanceof Array){
				type = 'Collection';
				break;
			}
			type = 'Singleton';
			break;
		case 'function':
			// is it a constructor?
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
/**
 * global accessors
 */
	Namespace.prototype = {__ns : ns, __load : load};
	Namespace.prototype.constructor = Namespace;
	exports.Namespace = Namespace;
	exports.Module = Module;
	exports.__ns = ns;
	exports.__load = load;
})((typeof exports !== undefined)? this:exports);