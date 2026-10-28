Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
const require_createStoreContext = require('./createStoreContext.cjs');
const require_useCreateAtom = require('./useCreateAtom.cjs');
const require_useCreateStore = require('./useCreateStore.cjs');
const require_useSelector = require('./useSelector.cjs');
const require_useAtom = require('./useAtom.cjs');
const require__useStore = require('./_useStore.cjs');
const require_useStore = require('./useStore.cjs');

exports._useStore = require__useStore._useStore;
exports.createStoreContext = require_createStoreContext.createStoreContext;
exports.useAtom = require_useAtom.useAtom;
exports.useCreateAtom = require_useCreateAtom.useCreateAtom;
exports.useCreateStore = require_useCreateStore.useCreateStore;
exports.useSelector = require_useSelector.useSelector;
exports.useStore = require_useStore.useStore;
var _tanstack_store = require("@tanstack/store");
Object.keys(_tanstack_store).forEach(function (k) {
  if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () { return _tanstack_store[k]; }
  });
});
