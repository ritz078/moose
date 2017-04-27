import 'rxjs';
import { ajax } from 'rxjs/observable/dom/ajax';
import qs from 'query-string';
import { showToast } from '../components/Toast';

export default function (action$, { dispatch, getState }) {
  return action$.ofType('FETCH_RESULTS').mergeMap((action) => {
    const params = Object.assign({}, getState().params);

    const searchTerm = action.payload || getState().params.searchTerm;
    const stringifiedParams = qs.stringify(params);
    dispatch({ type: 'START_LOADING' });

    if (params.page === 1) {
      dispatch({ type: 'RESET_RESULTS' });
    }

    return ajax
      .getJSON(
        `http://${window.location.hostname}:7500/api/search/${searchTerm}?${stringifiedParams}`
      )
      .retry(3)
      .switchMap(data => [
        {
          type: 'SET_RESULTS',
          payload: {
            searchTerm,
            data: data.data,
            page: data.page
          }
        },
        {
          type: 'STOP_LOADING'
        }
      ])
      .catch((err) => {
        showToast(err.message, 'error');
        return [
          {
            type: 'STOP_LOADING'
          }
        ];
      });
  });
}
