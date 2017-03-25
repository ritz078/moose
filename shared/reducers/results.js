import { createReducer } from 'redux-create-reducer';

const resultsReducer = createReducer([], {
  SET_RESULTS: (state, action) => (action.payload),
});

export default resultsReducer;
