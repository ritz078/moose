webpackHotUpdate(5,{

/***/ 763:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetchDetails;

__webpack_require__(660);

var _Observable = __webpack_require__(555);

var _ajax = __webpack_require__(598);

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

 ;(function register() { /* react-hot-loader/webpack */ if (true) { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } if (typeof module.exports === 'function') { __REACT_HOT_LOADER__.register(module.exports, 'module.exports', "/Users/ritz078/projects/blizzard/shared/epics/details.js"); return; } for (var key in module.exports) { if (!Object.prototype.hasOwnProperty.call(module.exports, key)) { continue; } var namedExport = void 0; try { namedExport = module.exports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/ritz078/projects/blizzard/shared/epics/details.js"); } } })();

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zaGFyZWQvZXBpY3MvZGV0YWlscy5qcz85YjgxYTA2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDUzs7QUFHVDs7QUFBZSxTQUFTLGFBQWEsZUFBdUI7TUFBQSxnQkFDMUQ7O2lCQUFlLE9BQU8saUJBQ25CLFNBQVMsVUFBQyxRQUNUO2FBQVMsRUFBRSxNQUNYO3NCQUNPLDJEQUE4RCxPQUFPLEtBQUssT0FBTywyQkFBc0IsSUFBSSxPQUFPO3VCQUNwRztBQUFqQixLQURGLEVBR0csTUFBTSxHQUNOLFFBQVEsTUFDUixVQUFVOztjQUdQO2lCQUZEO0FBQ0MsT0FERjtjQUlRO0FBQU47QUFWTixPQWFHLE1BQU07b0NBQWtCO2NBQ2pCO0FBQU4sT0FEWTtBQUluQjtBQUNKLEdBdEJRIiwiZmlsZSI6IjUuYjgxZjI0NGI1ZWY0YzUzZGI1N2YuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAncnhqcyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGFqYXggfSBmcm9tICdyeGpzL29ic2VydmFibGUvZG9tL2FqYXgnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmZXRjaERldGFpbHMoYWN0aW9uJCwgeyBkaXNwYXRjaCB9KSB7XG4gIHJldHVybiBhY3Rpb24kLm9mVHlwZSgnRkVUQ0hfREVUQUlMUycpXG4gICAgLm1lcmdlTWFwKChhY3Rpb24pID0+IHtcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogJ1NUQVJUX0xPQURJTkcnIH0pO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgYWpheC5nZXRKU09OKGBodHRwOi8vbG9jYWxob3N0OiR7U0VSVkVSX1BPUlR9L2FwaS9saXN0P3RvcnJlbnRJZD0ke3dpbmRvdy5idG9hKGFjdGlvbi5wYXlsb2FkKX0mdGltZXN0YW1wPSR7bmV3IERhdGUoKS5nZXRUaW1lKCl9YCwge1xuICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcbiAgICAgICAgfSlcbiAgICAgICAgICAucmV0cnkoMylcbiAgICAgICAgICAudGltZW91dCg2MDAwKVxuICAgICAgICAgIC5zd2l0Y2hNYXAocGF5bG9hZCA9PiAoXG4gICAgICAgICAgICBbe1xuICAgICAgICAgICAgICB0eXBlOiAnU0VUX0RFVEFJTFMnLFxuICAgICAgICAgICAgICBwYXlsb2FkLFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICB0eXBlOiAnU1RPUF9MT0FESU5HJyxcbiAgICAgICAgICAgIH1dXG4gICAgICAgICAgKSlcbiAgICAgICAgICAuY2F0Y2goKCkgPT4gKE9ic2VydmFibGUub2Yoe1xuICAgICAgICAgICAgdHlwZTogJ1NUT1BfTE9BRElORycsXG4gICAgICAgICAgfSkpKVxuICAgICAgKTtcbiAgICB9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NoYXJlZC9lcGljcy9kZXRhaWxzLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==