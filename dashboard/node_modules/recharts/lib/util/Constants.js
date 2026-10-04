"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_Y_AXIS_WIDTH = exports.DEFAULT_X_AXIS_HEIGHT = exports.DATA_ITEM_INDEX_ATTRIBUTE_NAME = exports.DATA_ITEM_GRAPHICAL_ITEM_ID_ATTRIBUTE_NAME = exports.COLOR_PANEL = void 0;
var COLOR_PANEL = exports.COLOR_PANEL = ['#1890FF', '#66B5FF', '#41D9C7', '#2FC25B', '#6EDB8F', '#9AE65C', '#FACC14', '#E6965C', '#57AD71', '#223273', '#738AE6', '#7564CC', '#8543E0', '#A877ED', '#5C8EE6', '#13C2C2', '#70E0E0', '#5CA3E6', '#3436C7', '#8082FF', '#DD81E6', '#F04864', '#FA7D92', '#D598D9'];

/**
 * We use this attribute to identify which element is the one that the user is touching.
 * The index is the position of the element in the data array.
 * This can be either a number (for array-based charts) or a string (for the charts that have a matrix-shaped data).
 */
var DATA_ITEM_INDEX_ATTRIBUTE_NAME = exports.DATA_ITEM_INDEX_ATTRIBUTE_NAME = 'data-recharts-item-index';

/**
 * We use this attribute to identify which element is the one that the user is touching.
 * Unlike dataKey, or name, it is always unique.
 */
var DATA_ITEM_GRAPHICAL_ITEM_ID_ATTRIBUTE_NAME = exports.DATA_ITEM_GRAPHICAL_ITEM_ID_ATTRIBUTE_NAME = 'data-recharts-item-id';
var DEFAULT_Y_AXIS_WIDTH = exports.DEFAULT_Y_AXIS_WIDTH = 60;
var DEFAULT_X_AXIS_HEIGHT = exports.DEFAULT_X_AXIS_HEIGHT = 30;