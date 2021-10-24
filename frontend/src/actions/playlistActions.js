import {
  PLAYLIST_DETAILS_REQUEST,
  PLAYLIST_DETAILS_SUCCESS,
} from '../constants/playlistConstants';

import getFormattedPlaylist from '../utils/getFormattedPlaylist';

export const listPlaylistDetails = () => (dispatch, getState) => {
  dispatch({ type: PLAYLIST_DETAILS_REQUEST });

  const {
    reviewDetails: { review },
  } = getState();

  if (review && review.media) {
    const playlist = getFormattedPlaylist(review.media);
    dispatch({ type: PLAYLIST_DETAILS_SUCCESS, payload: playlist });
  }
};
