import { combineReducers } from 'redux';
import results from './results';
import details from './details';
import loading from './loading';

export default combineReducers({
  results,
  details,
  loading,
});
