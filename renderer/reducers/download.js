import { createReducer } from 'redux-create-reducer';
const config = require('application-config')('Snape');

const downloadReducer = createReducer([], {
  ADD_TO_DOWNLOAD_LIST: (state, { payload }) => {
    const cloned = state.slice(0);
    cloned.push(payload);

    config.write({ download: cloned });

    return cloned;
  },

  SET_DOWNLOADS: (state, { payload }) => payload
});

export default downloadReducer;
