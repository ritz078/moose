import { createReducer } from 'redux-create-reducer';
import { findIndex, clone } from 'lodash';
import { addToConfig } from '../utils/config';

const downloadReducer = createReducer([], {
  ADD_TO_DOWNLOAD_LIST: (state, { payload }) => {
    const index = findIndex(state, o => o.infoHash === payload.infoHash);

    if (index >= 0) return state;

    const cloned = clone(state);
    cloned.push(payload);

    addToConfig({ download: cloned });

    return cloned;
  },

  REMOVE_FROM_DOWNLOAD_LIST: (state, { payload }) => {
    const cloned = clone(state);

    const index = findIndex(cloned, o => o.infoHash === payload);
    cloned.splice(index, 1);

    addToConfig({ download: cloned });

    return cloned;
  },

  SET_DOWNLOADS: (state, { payload }) => payload
});

export default downloadReducer;
