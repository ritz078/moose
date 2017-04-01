'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxCreateReducer = require('redux-create-reducer');

var loadingReducer = (0, _reduxCreateReducer.createReducer)(false, {
  START_LOADING: function START_LOADING() {
    return true;
  },
  STOP_LOADING: function STOP_LOADING() {
    return false;
  }
});

exports.default = loadingReducer;