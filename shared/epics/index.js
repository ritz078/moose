import { combineEpics } from 'redux-observable';
import resultEpic from './results';
import { fetchDetails } from './details';

export default combineEpics(
  resultEpic,
  fetchDetails,
);
