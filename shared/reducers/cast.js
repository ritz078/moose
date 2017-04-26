import { createReducer } from 'redux-create-reducer';

const initialState = {
  players: [],
  streamingMedia: null,
  selectedPlayer: null
};

const castReducer = createReducer(initialState, {
  SET_STREAMING_FILE: (state, action) =>
    Object.assign({}, state, {
      streamingMedia: action.payload
    }),
  REMOVE_STREAMING_FILE: state =>
    Object.assign({}, state, {
      streamingMedia: null
    }),
  SET_PLAYERS: (state, { payload }) =>
    Object.assign({}, state, {
      players: payload
    }),
  ADD_PLAYER: (state, { payload }) => {
    const players = state.players.slice(0);
    players.push(payload);

    return Object.assign({}, state, {
      players
    });
  },
  SET_SELECTED_PLAYER: (state, { payload }) =>
    Object.assign({}, state, {
      selectedPlayer: payload
    }),
  REMOVE_SELECTED_PLAYER: state =>
    Object.assign({}, state, {
      selectedPlayer: null
    })
});

export default castReducer;
