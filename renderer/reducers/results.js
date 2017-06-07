import { createReducer } from 'redux-create-reducer';
import { cloneDeep } from 'lodash';

const initialState = {
  data: [],
  searchTerm: '',
  loading: false,
  hasNextPage: false,
};

const resultsReducer = createReducer(initialState, {
  SET_RESULTS: (state, action) => {
    if (action.payload.page) {
      const newState = cloneDeep(state);
      newState.data = newState.data.concat(action.payload.data);
      newState.searchTerm = action.payload.searchTerm;
      newState.page = action.payload.page;
      newState.hasNextPage = action.payload.hasNextPage;
      return newState;
    }
    return Object.assign({}, state, action.payload);
  },

  START_RESULTS_LOADING: state =>
    Object.assign({}, state, {
      loading: true,
    }),

  STOP_RESULTS_LOADING: state =>
    Object.assign({}, state, {
      loading: false,
    }),
});

export default resultsReducer;
