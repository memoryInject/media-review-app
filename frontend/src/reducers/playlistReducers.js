import {
  PLAYLIST_DETAILS_REQUEST,
  PLAYLIST_DETAILS_SUCCESS,
  PLAYLIST_DETAILS_FAIL,
  PLAYLIST_DETAILS_RESET,
} from '../constants/playlistConstants';

export const playlistDetailsReducer = (
  state = { playlist: null, review: null, loading: null, error: null },
  action
) => {
  switch (action.type) {
    case PLAYLIST_DETAILS_REQUEST:
      return { loading: true, playlist: state.playlist, review: state.review };

    case PLAYLIST_DETAILS_SUCCESS:
      return {
        loading: false,
        playlist: action.payload.playlist,
        review: action.payload.review,
      };

    case PLAYLIST_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
        playlist: null,
        review: null,
      };

    case PLAYLIST_DETAILS_RESET:
      return { loading: false, playlist: null, review: null, error: null };

    default:
      return state;
  }
};
