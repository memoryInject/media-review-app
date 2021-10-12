import {
  PLAYER_HEIGHT,
  PLAYER_TOP,
  PLAYER_WIDTH,
  PLAYER_CURRENT_TIME,
  PLAYER_SEEK_TO,
} from '../constants/playerConstants';

export const heightPlayer = (height) => {
  return {
    type: PLAYER_HEIGHT,
    payload: height,
  };
};

export const widthPlayer = (width) => {
  return {
    type: PLAYER_WIDTH,
    payload: width,
  };
};

export const topPlayer = (top) => {
  return {
    type: PLAYER_TOP,
    payload: top,
  };
};

export const currentTimePlayer = (time) => {
  return {
    type: PLAYER_CURRENT_TIME,
    payload: time,
  };
};

export const seekToPlayer = (time) => {
  return {
    type: PLAYER_SEEK_TO,
    payload: time,
  };
};
