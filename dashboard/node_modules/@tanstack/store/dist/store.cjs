const require_atom = require('./atom.cjs');

//#region src/store.ts
var Store = class {
	constructor(valueOrFn, actionsFactory) {
		this.atom = require_atom.createAtom(valueOrFn);
		this.get = this.get.bind(this);
		this.setState = this.setState.bind(this);
		this.subscribe = this.subscribe.bind(this);
		if (actionsFactory) this.actions = actionsFactory(this);
	}
	setState(updater) {
		this.atom.set(updater);
	}
	get state() {
		return this.atom.get();
	}
	get() {
		return this.state;
	}
	subscribe(observerOrFn) {
		return this.atom.subscribe(require_atom.toObserver(observerOrFn));
	}
};
var ReadonlyStore = class {
	constructor(valueOrFn) {
		this.atom = require_atom.createAtom(valueOrFn);
	}
	get state() {
		return this.atom.get();
	}
	get() {
		return this.state;
	}
	subscribe(observerOrFn) {
		return this.atom.subscribe(require_atom.toObserver(observerOrFn));
	}
};
function createStore(valueOrFn, actions) {
	if (typeof valueOrFn === "function") return new ReadonlyStore(valueOrFn);
	if (actions) return new Store(valueOrFn, actions);
	return new Store(valueOrFn);
}

//#endregion
exports.ReadonlyStore = ReadonlyStore;
exports.Store = Store;
exports.createStore = createStore;
//# sourceMappingURL=store.cjs.map