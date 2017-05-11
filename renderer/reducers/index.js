import { combineReducers } from 'redux';
import results from './results';
import details from './details';
import loading from './loading';
import params from './params';
import cast from './cast';
import download from './download';
import selectedTorrent from './selectedTorrent';

export default combineReducers({
  results,
  details,
  loading,
  params,
  cast,
  download,
  selectedTorrent
});
