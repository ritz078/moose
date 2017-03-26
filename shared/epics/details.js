import 'rxjs';
import { ajax } from 'rxjs/observable/dom/ajax';

export function fetchDetails(action$, { dispatch }) {
  return action$.ofType('FETCH_DETAILS')
    .mergeMap((action) => {
      dispatch({ type: 'START_LOADING' });
      return (
        ajax.getJSON(`/api/list?torrentId=${window.btoa(action.payload)}&timestamp=${new Date().getTime()}`, {
          withCredentials: true,
        })
          .retry(3)
          .switchMap(payload => (
            [{
              type: 'SET_DETAILS',
              payload,
            }, {
              type: 'STOP_LOADING',
            }]
          ))
      );
    });
}
