import { createReducer } from 'redux-create-reducer';

const initialState = {
  data: [],
  searchTerm: '',
};

const resultsReducer = createReducer(initialState, {
  SET_RESULTS: (state, action) => (action.payload),
  SET_SEARCHTERM: (state, action) => Object.assign({}, state, {
    searchTerm: action.payload,
  }),
});

export default resultsReducer;
