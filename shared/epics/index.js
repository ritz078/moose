import { combineEpics } from 'redux-observable';
import resultEpic from './results';

export default combineEpics(
  resultEpic,
);
