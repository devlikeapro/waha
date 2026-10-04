//#region \0@oxc-project+runtime@0.144.0/helpers/esm/checkPrivateRedeclaration.js
function _checkPrivateRedeclaration(e, t) {
	if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
//#endregion
//#region \0@oxc-project+runtime@0.144.0/helpers/esm/classPrivateFieldInitSpec.js
function _classPrivateFieldInitSpec(e, t, a) {
	_checkPrivateRedeclaration(e, t), t.set(e, a);
}
//#endregion
//#region \0@oxc-project+runtime@0.144.0/helpers/esm/assertClassBrand.js
function _assertClassBrand(e, t, n) {
	if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
	throw new TypeError("Private element is not present on this object");
}
//#endregion
//#region \0@oxc-project+runtime@0.144.0/helpers/esm/classPrivateFieldGet2.js
function _classPrivateFieldGet2(s, a) {
	return s.get(_assertClassBrand(s, a));
}
//#endregion
//#region \0@oxc-project+runtime@0.144.0/helpers/esm/classPrivateFieldSet2.js
function _classPrivateFieldSet2(s, a, r) {
	return s.set(_assertClassBrand(s, a), r), r;
}
//#endregion
Object.defineProperty(exports, "_assertClassBrand", {
	enumerable: true,
	get: function() {
		return _assertClassBrand;
	}
});
Object.defineProperty(exports, "_checkPrivateRedeclaration", {
	enumerable: true,
	get: function() {
		return _checkPrivateRedeclaration;
	}
});
Object.defineProperty(exports, "_classPrivateFieldGet2", {
	enumerable: true,
	get: function() {
		return _classPrivateFieldGet2;
	}
});
Object.defineProperty(exports, "_classPrivateFieldInitSpec", {
	enumerable: true,
	get: function() {
		return _classPrivateFieldInitSpec;
	}
});
Object.defineProperty(exports, "_classPrivateFieldSet2", {
	enumerable: true,
	get: function() {
		return _classPrivateFieldSet2;
	}
});
