import {
  MEDIA_CREATE_FAIL,
  MEDIA_CREATE_REQUEST,
  MEDIA_CREATE_RESET,
  MEDIA_CREATE_SUCCESS,
  MEDIA_CREATE_PARENT,
  MEDIA_DETAILS_FAIL,
  MEDIA_DETAILS_REQUEST,
  MEDIA_DETAILS_RESET,
  MEDIA_DETAILS_SUCCESS,
  MEDIA_UPDATE_FAIL,
  MEDIA_UPDATE_REQUEST,
  MEDIA_UPDATE_RESET,
  MEDIA_UPDATE_SUCCESS,
  MEDIA_CREATE_PARENT_RESET,
  MEDIA_CREATE_SHOW,
  MEDIA_CREATE_HIDE,
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

export const mediaCreateReducer = (
  state = { media: null, parent: null, show: false },
  action
) => {
  switch (action.type) {
    case MEDIA_CREATE_REQUEST:
      return {
        loading: true,
        media: null,
        show: state.show,
        parent: state.parent,
      };

    case MEDIA_CREATE_SUCCESS:
      return {
        loading: false,
        media: action.payload,
        show: state.show,
        parent: state.parent,
      };

    case MEDIA_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
        show: state.show,
        parent: state.parent,
      };

    case MEDIA_CREATE_RESET:
      return {
        loading: false,
        media: null,
        show: state.show,
        parent: state.parent,
      };

    case MEDIA_CREATE_PARENT:
      return { ...state, parent: action.payload };

    case MEDIA_CREATE_PARENT_RESET:
      return { ...state, parent: null };

    case MEDIA_CREATE_SHOW:
      return { ...state, show: true };

    case MEDIA_CREATE_HIDE:
      return { ...state, show: false };

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
