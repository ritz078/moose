import { createReducer } from 'redux-create-reducer';

const resultsReducer = createReducer(
  {
    loading: false
  },
  {
    SET_DETAILS: (state, action) =>
      Object.assign({}, action.payload, {
        loading: false
      }),
    RESET_DETAILS: () => ({
      loading: true
    })
  }
);

export default resultsReducer;
