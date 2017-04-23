import { createReducer } from 'redux-create-reducer';

const resultsReducer = createReducer([], {
  SET_DETAILS: (state, action) => action.payload,
  RESET_DETAILS: () => []
});

export default resultsReducer;
