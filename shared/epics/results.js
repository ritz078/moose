import 'rxjs';
import { ajax } from 'rxjs/observable/dom/ajax';

export default function (action$, { dispatch }) {
  return action$.ofType('FETCH_RESULTS')
    .mergeMap((action) => {
      dispatch({ type: 'START_LOADING' });
      return (
        ajax.getJSON(`/api/search/${action.payload}`)
          .retry(3)
          .switchMap(data => ([{
            type: 'SET_RESULTS',
            payload: {
              searchTerm: action.payload,
              data,
            },
          }, {
            type: 'STOP_LOADING',
          }]))
      );
    });
}
