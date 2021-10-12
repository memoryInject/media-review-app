import {
  MEDIA_DETAILS_FAIL,
  MEDIA_DETAILS_REQUEST,
  MEDIA_DETAILS_RESET,
  MEDIA_DETAILS_SUCCESS,
} from '../constants/mediaConstants';

export const mediaDetailsReducer = (state = { media: null }, action) => {
  switch (action.type) {
    case MEDIA_DETAILS_REQUEST:
      return { loading: true, media: null };

    case MEDIA_DETAILS_SUCCESS:
      return { loading: false, media: action.payload };

    case MEDIA_DETAILS_FAIL:
      return { loading: false, error: action.payload };

    case MEDIA_DETAILS_RESET:
      return { loading: false, media: null };

    default:
      return state;
  }
};
