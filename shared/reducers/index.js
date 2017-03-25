import { combineReducers } from 'redux';
import resultsReducer from './results';

export default combineReducers({
  results: resultsReducer,
});
