import {
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_TOP,
  PLAYER_CURRENT_TIME,
  PLAYER_SEEK_TO,
} from '../constants/playerConstants';

export const playerDeatilsReducer = (
  state = { stop: false, seekTo: 0.0, currentTime: 0.0 },
  action
) => {
  switch (action.type) {
    case PLAYER_HEIGHT:
      return { ...state, height: action.payload };

    case PLAYER_WIDTH:
      return { ...state, width: action.payload };

    case PLAYER_TOP:
      return { ...state, top: action.payload };

    case PLAYER_CURRENT_TIME:
      return { ...state, currentTime: action.payload };

    case PLAYER_SEEK_TO:
      return { ...state, seekTo: action.payload };

    default:
      return state;
  }
};
