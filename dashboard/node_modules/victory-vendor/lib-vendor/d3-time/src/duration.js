"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.durationYear = exports.durationWeek = exports.durationSecond = exports.durationMonth = exports.durationMinute = exports.durationHour = exports.durationDay = void 0;
const durationSecond = exports.durationSecond = 1000;
const durationMinute = exports.durationMinute = durationSecond * 60;
const durationHour = exports.durationHour = durationMinute * 60;
const durationDay = exports.durationDay = durationHour * 24;
const durationWeek = exports.durationWeek = durationDay * 7;
const durationMonth = exports.durationMonth = durationDay * 30;
const durationYear = exports.durationYear = durationDay * 365;