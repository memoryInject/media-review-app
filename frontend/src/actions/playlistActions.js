import {
  PLAYLIST_DETAILS_REQUEST,
  PLAYLIST_DETAILS_SUCCESS,
} from '../constants/playlistConstants';

import getFormattedPlaylist from '../utils/getFormattedPlaylist';

export const listPlaylistDetails = () => (dispatch, getState) => {
  dispatch({ type: PLAYLIST_DETAILS_REQUEST });

  const {
    mediaList: {media, review}
  } = getState();

  if (media && review) {
    const playlist = getFormattedPlaylist(media);
    const data = {playlist, review: {id: review.id}}
    dispatch({ type: PLAYLIST_DETAILS_SUCCESS, payload: data });
  }
};
