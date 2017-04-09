import { createReducer } from 'redux-create-reducer';

const initialState = {
  data: [],
  searchTerm: '',
};

const resultsReducer = createReducer(initialState, {
  SET_RESULTS: (state, action) => (action.payload),
});

export default resultsReducer;
