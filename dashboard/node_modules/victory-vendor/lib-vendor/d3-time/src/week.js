"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wednesdays = exports.wednesday = exports.tuesdays = exports.tuesday = exports.thursdays = exports.thursday = exports.sundays = exports.sunday = exports.saturdays = exports.saturday = exports.mondays = exports.monday = exports.fridays = exports.friday = void 0;
var _interval = _interopRequireDefault(require("./interval.js"));
var _duration = require("./duration.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function weekday(i) {
  return (0, _interval.default)(function (date) {
    date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
    date.setHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setDate(date.getDate() + step * 7);
  }, function (start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * _duration.durationMinute) / _duration.durationWeek;
  });
}
var sunday = exports.sunday = weekday(0);
var monday = exports.monday = weekday(1);
var tuesday = exports.tuesday = weekday(2);
var wednesday = exports.wednesday = weekday(3);
var thursday = exports.thursday = weekday(4);
var friday = exports.friday = weekday(5);
var saturday = exports.saturday = weekday(6);
var sundays = exports.sundays = sunday.range;
var mondays = exports.mondays = monday.range;
var tuesdays = exports.tuesdays = tuesday.range;
var wednesdays = exports.wednesdays = wednesday.range;
var thursdays = exports.thursdays = thursday.range;
var fridays = exports.fridays = friday.range;
var saturdays = exports.saturdays = saturday.range;