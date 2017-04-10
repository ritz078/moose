import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { ajax } from 'rxjs/observable/dom/ajax';
import { showToast } from '../components/Toast';

export default function fetchDetails(action$, { dispatch }) {
  return action$.ofType('FETCH_DETAILS')
    .mergeMap((action) => {
      dispatch({ type: 'START_LOADING' });
      return (
        ajax.getJSON(`http://${window.location.hostname}:${SERVER_PORT}/api/list?torrentId=${window.btoa(action.payload)}&timestamp=${new Date().getTime()}`, {
          withCredentials: true,
        })
          .retry(3)
          .timeout(6000)
          .switchMap(payload => (
            [{
              type: 'SET_DETAILS',
              payload,
            }, {
              type: 'STOP_LOADING',
            }]
          ))
          .catch((err) => {
            showToast(err.message, 'error');
            return (Observable.of({
              type: 'STOP_LOADING',
            }));
          })
      );
    });
}
