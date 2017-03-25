import 'rxjs';
import { ajax } from 'rxjs/observable/dom/ajax';

export default function (action$) {
  return action$.ofType('FETCH_RESULTS')
    .mergeMap(action => (
      ajax.getJSON(`/api/search/${action.payload}`)
        .retry(3)
        .map(payload => ({
          type: 'SET_RESULTS',
          payload,
        }))
    ));
}
