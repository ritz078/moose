import { createReducer } from 'redux-create-reducer';

const initialState = {
  page: 1,
  orderBy: 'seeds',
  sortBy: 'desc',
};

const paramsReducer = createReducer(initialState, {
  SET_PAGE: (state, action) => Object.assign({}, state, { page: action.payload }),
  SET_SORT_ORDER: (state, action) => Object.assign({}, state, {
    sortBy: action.payload.sortBy,
    orderBy: action.payload.orderBy,
  }),
});

export default paramsReducer;
