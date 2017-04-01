'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var _reduxObservable = require('redux-observable');

var _epics = require('./shared/epics');

var _epics2 = _interopRequireDefault(_epics);

var _reducers = require('./shared/reducers');

var _reducers2 = _interopRequireDefault(_reducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initStore = function initStore(initialState) {
  var epicMiddleware = (0, _reduxObservable.createEpicMiddleware)(_epics2.default);

  // eslint-disable-next-line no-underscore-dangle
  var composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || _redux.compose;

  var enhancer = composeEnhancers((0, _redux.applyMiddleware)(epicMiddleware));

  return (0, _redux.createStore)(_reducers2.default, initialState, enhancer);
};

exports.default = initStore;