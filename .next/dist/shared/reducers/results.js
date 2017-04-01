'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _reduxCreateReducer = require('redux-create-reducer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {
  data: [],
  searchTerm: ''
};

var resultsReducer = (0, _reduxCreateReducer.createReducer)(initialState, {
  SET_RESULTS: function SET_RESULTS(state, action) {
    return action.payload;
  },
  SET_SEARCHTERM: function SET_SEARCHTERM(state, action) {
    return (0, _assign2.default)({}, state, {
      searchTerm: action.payload
    });
  }
});

exports.default = resultsReducer;