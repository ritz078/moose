import { createReducer } from 'redux-create-reducer';

const resultsReducer = createReducer([], {
  SET_DETAILS: (state, action) => action.payload
});

export default resultsReducer;
