import { createReducer } from 'redux-create-reducer';
import { findIndex, clone } from 'lodash';

const config = require('application-config')('Snape');

const downloadReducer = createReducer([], {
  ADD_TO_DOWNLOAD_LIST: (state, { payload }) => {
    const cloned = clone(state);
    cloned.push(payload);

    config.write({ download: cloned });

    return cloned;
  },

  REMOVE_FROM_DOWNLOAD_LIST: (state, { payload }) => {
    const cloned = clone(state);

    const index = findIndex(cloned, o => o.magnetLink === payload);
    cloned.splice(index, 1);

    config.write({ download: cloned });

    return cloned;
  },

  SET_DOWNLOADS: (state, { payload }) => payload
});

export default downloadReducer;
