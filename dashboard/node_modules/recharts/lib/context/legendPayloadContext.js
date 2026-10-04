"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLegendPayload = useLegendPayload;
var _hooks = require("../state/hooks");
var _legendSelectors = require("../state/selectors/legendSelectors");
/**
 * Use this hook in Legend, or anywhere else where you want to read the current Legend items.
 * @return all Legend items ready to be rendered
 */
function useLegendPayload() {
  return (0, _hooks.useAppSelector)(_legendSelectors.selectLegendPayload);
}