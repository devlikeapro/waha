Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let node_fs = require("node:fs");
node_fs = __toESM(node_fs, 1);
let node_path = require("node:path");
node_path = __toESM(node_path, 1);
let cacheable = require("cacheable");
let flatted = require("flatted");
let hookified = require("hookified");
//#region src/index.ts
let FlatCacheEvents = /* @__PURE__ */ function(FlatCacheEvents) {
	FlatCacheEvents["SAVE"] = "save";
	FlatCacheEvents["LOAD"] = "load";
	FlatCacheEvents["DELETE"] = "delete";
	FlatCacheEvents["CLEAR"] = "clear";
	FlatCacheEvents["DESTROY"] = "destroy";
	FlatCacheEvents["ERROR"] = "error";
	FlatCacheEvents["EXPIRED"] = "expired";
	return FlatCacheEvents;
}({});
var FlatCache = class extends hookified.Hookified {
	_cache = new cacheable.CacheableMemory();
	_cacheDir = ".cache";
	_cacheId = "cache1";
	_persistInterval = 0;
	_persistTimer;
	_changesSinceLastSave = false;
	_parse = flatted.parse;
	_stringify = flatted.stringify;
	constructor(options) {
		super();
		if (options) this._cache = new cacheable.CacheableMemory({
			ttl: options.ttl,
			useClone: options.useClone,
			lruSize: options.lruSize,
			checkInterval: options.expirationInterval
		});
		if (options?.cacheDir) this._cacheDir = options.cacheDir;
		if (options?.cacheId) this._cacheId = options.cacheId;
		if (options?.persistInterval) {
			this._persistInterval = options.persistInterval;
			this.startAutoPersist();
		}
		if (options?.deserialize) this._parse = options.deserialize;
		if (options?.serialize) this._stringify = options.serialize;
	}
	/**
	* The cache object
	* @property cache
	* @type {CacheableMemory}
	*/
	get cache() {
		return this._cache;
	}
	/**
	* The cache directory
	* @property cacheDir
	* @type {String}
	* @default '.cache'
	*/
	get cacheDir() {
		return this._cacheDir;
	}
	/**
	* Set the cache directory
	* @property cacheDir
	* @type {String}
	* @default '.cache'
	*/
	set cacheDir(value) {
		this._cacheDir = value;
	}
	/**
	* The cache id
	* @property cacheId
	* @type {String}
	* @default 'cache1'
	*/
	get cacheId() {
		return this._cacheId;
	}
	/**
	* Set the cache id
	* @property cacheId
	* @type {String}
	* @default 'cache1'
	*/
	set cacheId(value) {
		this._cacheId = value;
	}
	/**
	* The flag to indicate if there are changes since the last save
	* @property changesSinceLastSave
	* @type {Boolean}
	* @default false
	*/
	get changesSinceLastSave() {
		return this._changesSinceLastSave;
	}
	/**
	* The interval to persist the cache to disk. 0 means no timed persistence
	* @property persistInterval
	* @type {Number}
	* @default 0
	*/
	get persistInterval() {
		return this._persistInterval;
	}
	/**
	* Set the interval to persist the cache to disk. 0 means no timed persistence
	* @property persistInterval
	* @type {Number}
	* @default 0
	*/
	set persistInterval(value) {
		this._persistInterval = value;
	}
	/**
	* Load a cache identified by the given Id. If the element does not exists, then initialize an empty
	* cache storage. If specified `cacheDir` will be used as the directory to persist the data to. If omitted
	* then the cache module directory `.cacheDir` will be used instead
	*
	* @method load
	* @param cacheId {String} the id of the cache, would also be used as the name of the file cache
	* @param cacheDir {String} directory for the cache entry
	*/
	load(cacheId, cacheDir) {
		try {
			const filePath = node_path.default.resolve(`${cacheDir ?? this._cacheDir}/${cacheId ?? this._cacheId}`);
			this.loadFile(filePath);
			this.emit("load");
		} catch (error) {
			/* v8 ignore next -- @preserve */
			this.emit("error", error);
		}
	}
	/**
	* Load the cache from the provided file
	* @method loadFile
	* @param  {String} pathToFile the path to the file containing the info for the cache
	*/
	loadFile(pathToFile) {
		if (node_fs.default.existsSync(pathToFile)) {
			const data = node_fs.default.readFileSync(pathToFile, "utf8");
			const items = this._parse(data);
			if (Array.isArray(items)) {
				for (const item of items) if (item && typeof item === "object" && "key" in item) if (item.expires) this._cache.set(item.key, item.value, { expire: item.expires });
				else if (item.timestamp)
 /* v8 ignore next -- @preserve */
				this._cache.set(item.key, item.value, { expire: item.timestamp });
				else this._cache.set(item.key, item.value);
			} else for (const key of Object.keys(items)) {
				const item = items[key];
				/* v8 ignore next -- @preserve */
				if (item && typeof item === "object" && "key" in item) this._cache.set(item.key, item.value, { expire: item.expires });
				else if (item && typeof item === "object" && item.timestamp)
 /* v8 ignore next -- @preserve */
				this._cache.set(key, item, { expire: item.timestamp });
				else this._cache.set(key, item);
			}
			this._changesSinceLastSave = true;
		}
	}
	loadFileStream(pathToFile, onProgress, onEnd, onError) {
		if (node_fs.default.existsSync(pathToFile)) {
			const total = node_fs.default.statSync(pathToFile).size;
			let loaded = 0;
			let streamData = "";
			const readStream = node_fs.default.createReadStream(pathToFile, { encoding: "utf8" });
			readStream.on("data", (chunk) => {
				loaded += chunk.length;
				streamData += chunk;
				onProgress(loaded, total);
			});
			readStream.on("end", () => {
				const items = this._parse(streamData);
				for (const key of Object.keys(items)) this._cache.set(items[key].key, items[key].value, { expire: items[key].expires });
				this._changesSinceLastSave = true;
				onEnd();
			});
			/* v8 ignore next -- @preserve */
			readStream.on("error", (error) => {
				this.emit("error", error);
				if (onError) onError(error);
			});
		} else {
			const error = /* @__PURE__ */ new Error(`Cache file ${pathToFile} does not exist`);
			this.emit("error", error);
			/* v8 ignore next -- @preserve */
			if (onError) onError(error);
		}
	}
	/**
	* Returns the entire persisted object
	* @method all
	* @returns {*}
	*/
	all() {
		const result = {};
		const items = [...this._cache.items];
		for (const item of items) result[item.key] = item.value;
		return result;
	}
	/**
	* Returns an array with all the items in the cache { key, value, expires }
	* @method items
	* @returns {Array}
	*/
	get items() {
		return [...this._cache.items];
	}
	/**
	* Returns the path to the file where the cache is persisted
	* @method cacheFilePath
	* @returns {String}
	*/
	get cacheFilePath() {
		return node_path.default.resolve(`${this._cacheDir}/${this._cacheId}`);
	}
	/**
	* Returns the path to the cache directory
	* @method cacheDirPath
	* @returns {String}
	*/
	get cacheDirPath() {
		return node_path.default.resolve(this._cacheDir);
	}
	/**
	* Returns an array with all the keys in the cache
	* @method keys
	* @returns {Array}
	*/
	keys() {
		return [...this._cache.keys];
	}
	/**
	* (Legacy) set key method. This method will be deprecated in the future
	* @method setKey
	* @param key {string} the key to set
	* @param value {object} the value of the key. Could be any object that can be serialized with JSON.stringify
	*/
	setKey(key, value, ttl) {
		this.set(key, value, ttl);
	}
	/**
	* Sets a key to a given value
	* @method set
	* @param key {string} the key to set
	* @param value {object} the value of the key. Could be any object that can be serialized with JSON.stringify
	* @param [ttl] {number} the time to live in milliseconds
	*/
	set(key, value, ttl) {
		this._cache.set(key, value, ttl);
		this._changesSinceLastSave = true;
	}
	/**
	* (Legacy) Remove a given key from the cache. This method will be deprecated in the future
	* @method removeKey
	* @param key {String} the key to remove from the object
	*/
	removeKey(key) {
		this.delete(key);
	}
	/**
	* Remove a given key from the cache
	* @method delete
	* @param key {String} the key to remove from the object
	*/
	delete(key) {
		this._cache.delete(key);
		this._changesSinceLastSave = true;
		this.emit("delete", key);
	}
	/**
	* (Legacy) Return the value of the provided key. This method will be deprecated in the future
	* @method getKey<T>
	* @param key {String} the name of the key to retrieve
	* @returns {*} at T the value from the key
	*/
	getKey(key) {
		return this.get(key);
	}
	/**
	* Return the value of the provided key
	* @method get<T>
	* @param key {String} the name of the key to retrieve
	* @returns {*} at T the value from the key
	*/
	get(key) {
		return this._cache.get(key);
	}
	/**
	* Clear the cache and save the state to disk
	* @method clear
	*/
	clear() {
		try {
			this._cache.clear();
			this._changesSinceLastSave = true;
			this.save();
			this.emit("clear");
		} catch (error) {
			/* v8 ignore next -- @preserve */
			this.emit("error", error);
		}
	}
	/**
	* Save the state of the cache identified by the docId to disk
	* as a JSON structure
	* @method save
	*/
	save(force = false) {
		try {
			/* v8 ignore next -- @preserve */
			if (this._changesSinceLastSave || force) {
				const filePath = this.cacheFilePath;
				const items = [...this._cache.items];
				const data = this._stringify(items);
				if (!node_fs.default.existsSync(this._cacheDir)) node_fs.default.mkdirSync(this._cacheDir, { recursive: true });
				node_fs.default.writeFileSync(filePath, data);
				this._changesSinceLastSave = false;
				this.emit("save");
			}
		} catch (error) {
			/* v8 ignore next -- @preserve */
			this.emit("error", error);
		}
	}
	/**
	* Remove the file where the cache is persisted
	* @method removeCacheFile
	* @return {Boolean} true or false if the file was successfully deleted
	*/
	removeCacheFile() {
		try {
			if (node_fs.default.existsSync(this.cacheFilePath)) {
				node_fs.default.rmSync(this.cacheFilePath);
				return true;
			}
		} catch (error) {
			/* v8 ignore next -- @preserve */
			this.emit("error", error);
		}
		return false;
	}
	/**
	* Destroy the cache. This will remove the directory, file, and memory cache
	* @method destroy
	* @param [includeCacheDir=false] {Boolean} if true, the cache directory will be removed
	* @return {undefined}
	*/
	destroy(includeCacheDirectory = false) {
		try {
			this._cache.clear();
			this.stopAutoPersist();
			if (includeCacheDirectory) node_fs.default.rmSync(this.cacheDirPath, {
				recursive: true,
				force: true
			});
			else node_fs.default.rmSync(this.cacheFilePath, {
				recursive: true,
				force: true
			});
			this._changesSinceLastSave = false;
			this.emit("destroy");
		} catch (error) {
			/* v8 ignore next -- @preserve */
			this.emit("error", error);
		}
	}
	/**
	* Start the auto persist interval
	* @method startAutoPersist
	*/
	startAutoPersist() {
		/* v8 ignore next -- @preserve */
		if (this._persistInterval > 0) {
			if (this._persistTimer) {
				clearInterval(this._persistTimer);
				this._persistTimer = void 0;
			}
			this._persistTimer = setInterval(() => {
				this.save();
			}, this._persistInterval);
		}
	}
	/**
	* Stop the auto persist interval
	* @method stopAutoPersist
	*/
	stopAutoPersist() {
		if (this._persistTimer) {
			clearInterval(this._persistTimer);
			this._persistTimer = void 0;
		}
	}
};
var FlatCacheDefault = class {
	static create = create;
	static createFromFile = createFromFile;
	static clearCacheById = clearCacheById;
	static clearAll = clearAll;
};
/**
* Load a cache identified by the given Id. If the element does not exists, then initialize an empty
* cache storage.
*
* @method create
* @param docId {String} the id of the cache, would also be used as the name of the file cache
* @param cacheDirectory {String} directory for the cache entry
* @param options {FlatCacheOptions} options for the cache
* @returns {cache} cache instance
*/
function create(options) {
	const cache = new FlatCache(options);
	cache.load();
	return cache;
}
/**
* Load a cache from the provided file
* @method createFromFile
* @param  {String} filePath the path to the file containing the info for the cache
* @param options {FlatCacheOptions} options for the cache
* @returns {cache} cache instance
*/
function createFromFile(filePath, options) {
	const cache = new FlatCache(options);
	cache.loadFile(filePath);
	return cache;
}
/**
* Clear the cache identified by the given Id. This will only remove the cache from disk.
* @method clearCacheById
* @param cacheId {String} the id of the cache
* @param cacheDirectory {String} directory for the cache entry
*/
function clearCacheById(cacheId, cacheDirectory) {
	new FlatCache({
		cacheId,
		cacheDir: cacheDirectory
	}).destroy();
}
/**
* Clear the cache directory
* @method clearAll
* @param cacheDir {String} directory for the cache entry
*/
function clearAll(cacheDirectory) {
	node_fs.default.rmSync(cacheDirectory ?? ".cache", {
		recursive: true,
		force: true
	});
}
//#endregion
exports.FlatCache = FlatCache;
exports.FlatCacheEvents = FlatCacheEvents;
exports.clearAll = clearAll;
exports.clearCacheById = clearCacheById;
exports.create = create;
exports.createFromFile = createFromFile;
exports.default = FlatCacheDefault;
