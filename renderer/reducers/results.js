import { createReducer } from 'redux-create-reducer';
import { cloneDeep } from 'lodash';

const initialState = {
  data: [],
  searchTerm: ''
};

const resultsReducer = createReducer(initialState, {
  SET_RESULTS: (state, action) => {
    if (action.payload.page) {
      const newState = cloneDeep(state);
      newState.data = newState.data.concat(action.payload.data);
      newState.searchTerm = action.payload.searchTerm;
      newState.page = action.payload.page;
      return newState;
    }
    return action.payload;
  },

  RESET_RESULTS: state =>
    Object.assign({}, state, {
      data: [],
      searchTerm: ''
    })
});

export default resultsReducer;
