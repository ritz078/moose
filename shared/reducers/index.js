import { combineReducers } from 'redux';

// in a real redux app you'd want to use `window.location`
// but for our demo we'll use this fake one
const initialLocation = { pathname: '/', search: '', hash: '' };
const locationReducer = (state = initialLocation, action) => (action.type === 'LOCATION_CHANGE' ? action.location : state);

export default combineReducers({
  location: locationReducer,
});
