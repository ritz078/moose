import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { ajax } from 'rxjs/observable/dom/ajax';
import { showToast } from '../components/Toast';

export default function fetchDetails(action$, { dispatch }) {
  return action$.ofType('FETCH_DETAILS').mergeMap((action) => {
    dispatch({ type: 'START_LOADING' });
    dispatch({ type: 'RESET_DETAILS' });
    return ajax
      .getJSON(`/api/list?infoHash=${action.payload}&timestamp=${new Date().getTime()}`)
      .retry(3)
      .switchMap(payload => [
        {
          type: 'SET_DETAILS',
          payload,
        },
        {
          type: 'STOP_LOADING',
        },
      ])
      .catch((err) => {
        showToast(err.message, 'error');
        return Observable.of({
          type: 'STOP_LOADING',
        });
      });
  });
}
