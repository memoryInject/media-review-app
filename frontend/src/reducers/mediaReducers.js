import {
  MEDIA_CREATE_FAIL,
  MEDIA_CREATE_REQUEST,
  MEDIA_CREATE_RESET,
  MEDIA_CREATE_SUCCESS,
  MEDIA_CREATE_PARENT,
  MEDIA_LIST_FAIL,
  MEDIA_LIST_REQUEST,
  MEDIA_LIST_RESET,
  MEDIA_LIST_SUCCESS,
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
  MEDIA_DELETE_REQUEST,
  MEDIA_DELETE_SUCCESS,
  MEDIA_DELETE_FAIL,
  MEDIA_DELETE_RESET,
} from '../constants/mediaConstants';

export const mediaListReducer = (state = { media: null, review: null }, action) => {
  switch (action.type) {
    case MEDIA_LIST_REQUEST:
      return { loading: true, media: state.media, review: state.review };

    case MEDIA_LIST_SUCCESS:
      return { loading: false, media: action.payload.media, review: action.payload.review };

    case MEDIA_LIST_FAIL:
      return { loading: false, error: action.payload, media: null, review: null };

    case MEDIA_LIST_RESET:
      return { loading: false, media: null, review: null };

    default:
      return state;
  }
};

export const mediaDetailsReducer = (state = { media: null }, action) => {
  switch (action.type) {
    case MEDIA_DETAILS_REQUEST:
      return { loading: true, media: state.media };

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

export const mediaDeleteReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case MEDIA_DELETE_REQUEST:
      return { loading: true, success: false };

    case MEDIA_DELETE_SUCCESS:
      return { loading: false, success: true };

    case MEDIA_DELETE_FAIL:
      return { loading: false, error: action.payload, success: false };

    case MEDIA_DELETE_RESET:
      return { loading: false, success: false };

    default:
      return state;
  }
};
