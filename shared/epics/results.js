import 'rxjs';
import { ajax } from 'rxjs/observable/dom/ajax';
import qs from 'query-string';

export default function (action$, { dispatch, getState }) {
  return action$.ofType('FETCH_RESULTS')
    .mergeMap((action) => {
      const params = getState().params;

      const searchTerm = action.payload || getState().results.searchTerm;
      const stringifiedParams = qs.stringify(params);
      dispatch({ type: 'START_LOADING' });
      return (
        ajax.getJSON(`/api/search/${searchTerm}?${stringifiedParams}`)
          .retry(3)
          .switchMap(data => ([{
            type: 'SET_RESULTS',
            payload: {
              searchTerm,
              data: data.data,
              page: data.page,
            },
          }, {
            type: 'STOP_LOADING',
          }]))
      );
    });
}
