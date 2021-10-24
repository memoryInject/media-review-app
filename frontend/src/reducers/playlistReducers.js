import {
  PLAYLIST_DETAILS_REQUEST,
  PLAYLIST_DETAILS_SUCCESS,
  PLAYLIST_DETAILS_FAIL,
  PLAYLIST_DETAILS_RESET,
} from '../constants/playlistConstants';

export const playlistDetailsReducer = (
  state = { playlist: null, loading: null, error: null },
  action
) => {
  switch (action.type) {
    case PLAYLIST_DETAILS_REQUEST:
      return { loading: true, playlist: null };

    case PLAYLIST_DETAILS_SUCCESS:
      return { loading: false, playlist: action.payload };

    case PLAYLIST_DETAILS_FAIL:
      return { loading: false, error: action.payload, playlist: null };

    case PLAYLIST_DETAILS_RESET:
      return { loading: false, playlist: null, error: null };

    default:
      return state;
  }
};
