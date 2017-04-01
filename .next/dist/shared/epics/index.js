'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxObservable = require('redux-observable');

var _results = require('./results');

var _results2 = _interopRequireDefault(_results);

var _details = require('./details');

var _details2 = _interopRequireDefault(_details);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _reduxObservable.combineEpics)(_results2.default, _details2.default);