'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (action$, _ref) {
  var dispatch = _ref.dispatch,
      getState = _ref.getState;

  return action$.ofType('FETCH_RESULTS').mergeMap(function (action) {
    var params = getState().params;

    var searchTerm = action.payload || getState().results.searchTerm;
    var stringifiedParams = _queryString2.default.stringify(params);
    dispatch({ type: 'START_LOADING' });

    return _ajax.ajax.getJSON('http://localhost:4000' + '/api/search/' + searchTerm + '?' + stringifiedParams).retry(3).switchMap(function (data) {
      return [{
        type: 'SET_RESULTS',
        payload: {
          searchTerm: searchTerm,
          data: data.data,
          page: data.page
        }
      }, {
        type: 'STOP_LOADING'
      }];
    }).catch(function () {
      return [{
        type: 'STOP_LOADING'
      }];
    });
  });
};

require('rxjs');

var _ajax = require('rxjs/observable/dom/ajax');

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }