import { createReducer } from 'redux-create-reducer';
import deepCopy from 'deep-copy';

const initialState = {
  data: [],
  searchTerm: '',
};

const resultsReducer = createReducer(initialState, {
  SET_RESULTS: (state, action) => {
    if (action.payload.page > 1) {
      const newState = deepCopy(state);
      newState.data = newState.data.concat(action.payload.data);
      newState.searchTerm = action.payload.searchTerm;
      newState.page = action.payload.page;
      return newState;
    }
    return (action.payload);
  },
});

export default resultsReducer;
