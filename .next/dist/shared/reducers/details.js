'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxCreateReducer = require('redux-create-reducer');

var resultsReducer = (0, _reduxCreateReducer.createReducer)([], {
  SET_DETAILS: function SET_DETAILS(state, action) {
    return action.payload;
  }
});

exports.default = resultsReducer;