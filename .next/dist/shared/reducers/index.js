'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var _results = require('./results');

var _results2 = _interopRequireDefault(_results);

var _details = require('./details');

var _details2 = _interopRequireDefault(_details);

var _loading = require('./loading');

var _loading2 = _interopRequireDefault(_loading);

var _params = require('./params');

var _params2 = _interopRequireDefault(_params);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _redux.combineReducers)({
  results: _results2.default,
  details: _details2.default,
  loading: _loading2.default,
  params: _params2.default
});