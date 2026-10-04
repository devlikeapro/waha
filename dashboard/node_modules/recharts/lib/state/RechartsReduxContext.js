"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RechartsReduxContext = void 0;
var _react = require("react");
/*
 * This is a copy of the React-Redux context type, but with our own store type.
 * We could import directly from react-redux like this:
 * import { ReactReduxContextValue } from 'react-redux/src/components/Context';
 * but that makes typescript angry with some errors I am not sure how to resolve
 * so copy it is.
 */

/**
 * We need to use our own independent Redux context because we need to avoid interfering with other people's Redux stores
 * in case they decide to install and use Recharts in another Redux app which is likely to happen.
 *
 * https://react-redux.js.org/using-react-redux/accessing-store#providing-custom-context
 */
var RechartsReduxContext = exports.RechartsReduxContext = /*#__PURE__*/(0, _react.createContext)(null);