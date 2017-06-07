import 'rxjs';
import { ajax } from 'rxjs/observable/dom/ajax';
import qs from 'query-string';
import { showToast } from '../components/Toast';

export default function (action$, { dispatch, getState }) {
  return action$.ofType('FETCH_RESULTS').mergeMap((action) => {
    const params = Object.assign({}, getState().params);

    const searchTerm = action.payload || getState().params.searchTerm;
    const stringifiedParams = qs.stringify(params);
    if (params.page === 1) {
      dispatch({ type: 'START_RESULTS_LOADING' });
      dispatch({ type: 'RESET_DETAILS' });
    }

    return ajax
      .getJSON(`/api/search/${searchTerm}?${stringifiedParams}`)
      .retry(3)
      .switchMap(data => [
        {
          type: 'SET_RESULTS',
          payload: {
            searchTerm,
            data: data.data,
            page: data.page,
            hasNextPage: data.hasNextPage,
          },
        },
        {
          type: 'STOP_RESULTS_LOADING',
        },
      ])
      .catch((err) => {
        showToast(err.message, 'error');
        return [
          {
            type: 'STOP_RESULTS_LOADING',
          },
        ];
      });
  });
}
