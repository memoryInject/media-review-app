import {
  MEDIA_CREATE_FAIL,
  MEDIA_CREATE_REQUEST,
  MEDIA_CREATE_RESET,
  MEDIA_CREATE_SUCCESS,
  MEDIA_DETAILS_FAIL,
  MEDIA_DETAILS_REQUEST,
  MEDIA_DETAILS_RESET,
  MEDIA_DETAILS_SUCCESS,
  MEDIA_UPDATE_FAIL,
  MEDIA_UPDATE_REQUEST,
  MEDIA_UPDATE_RESET,
  MEDIA_UPDATE_SUCCESS,
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

export const mediaCreateReducer = (state = { media: null }, action) => {
  switch (action.type) {
    case MEDIA_CREATE_REQUEST:
      return { loading: true, media: null };

    case MEDIA_CREATE_SUCCESS:
      return { loading: false, media: action.payload };

    case MEDIA_CREATE_FAIL:
      return { loading: false, error: action.payload };

    case MEDIA_CREATE_RESET:
      return { loading: false, media: null };

    default:
      return state;
  }
};

export const mediaUpdateReducer = (state = { media: null }, action) => {
  switch (action.type) {
    case MEDIA_UPDATE_REQUEST:
      return { loading: true, media: null };

    case MEDIA_UPDATE_SUCCESS:
      return { loading: false, media: action.payload };

    case MEDIA_UPDATE_FAIL:
      return { loading: false, error: action.payload };

    case MEDIA_UPDATE_RESET:
      return { loading: false, media: null };

    default:
      return state;
  }
};

