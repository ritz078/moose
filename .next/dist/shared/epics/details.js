'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetchDetails;

require('rxjs');

var _Observable = require('rxjs/Observable');

var _ajax = require('rxjs/observable/dom/ajax');

function fetchDetails(action$, _ref) {
  var dispatch = _ref.dispatch;

  return action$.ofType('FETCH_DETAILS').mergeMap(function (action) {
    dispatch({ type: 'START_LOADING' });
    return _ajax.ajax.getJSON('http://localhost:4000' + '/api/list?torrentId=' + window.btoa(action.payload) + '&timestamp=' + new Date().getTime(), {
      withCredentials: true
    }).retry(3).timeout(6000).switchMap(function (payload) {
      return [{
        type: 'SET_DETAILS',
        payload: payload
      }, {
        type: 'STOP_LOADING'
      }];
    }).catch(function () {
      return _Observable.Observable.of({
        type: 'STOP_LOADING'
      });
    });
  });
}