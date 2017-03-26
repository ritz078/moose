import { createReducer } from 'redux-create-reducer';

const loadingReducer = createReducer(false, {
  START_LOADING: () => true,
  STOP_LOADING: () => false,
});

export default loadingReducer;
