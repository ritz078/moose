import { createReducer } from 'redux-create-reducer';

const selectedTorrentReducer = createReducer(
  {},
  {
    SET_SELECTED_TORRENT: (state, { payload }) => payload,
  },
);

export default selectedTorrentReducer;
