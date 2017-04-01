'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _reduxCreateReducer = require('redux-create-reducer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {
  page: 1,
  orderBy: 'seeds',
  sortBy: 'desc'
};

var paramsReducer = (0, _reduxCreateReducer.createReducer)(initialState, {
  SET_PAGE: function SET_PAGE(state, action) {
    return (0, _assign2.default)({}, state, { page: action.payload });
  },
  SET_SORT_ORDER: function SET_SORT_ORDER(state, action) {
    return (0, _assign2.default)({}, state, {
      sortBy: action.payload.sortBy,
      orderBy: action.payload.orderBy
    });
  }
});

exports.default = paramsReducer;