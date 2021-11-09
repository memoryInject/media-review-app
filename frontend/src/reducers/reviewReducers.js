import {
  REVIEW_DETAILS_FAIL,
  REVIEW_DETAILS_REQUEST,
  REVIEW_DETAILS_RESET,
  REVIEW_DETAILS_SUCCESS,
  REVIEW_CREATE_FAIL,
  REVIEW_CREATE_REQUEST,
  REVIEW_CREATE_RESET,
  REVIEW_CREATE_SUCCESS,
  REVIEW_UPDATE_FAIL,
  REVIEW_UPDATE_REQUEST,
  REVIEW_UPDATE_RESET,
  REVIEW_UPDATE_SUCCESS,
  REVIEW_DELETE_FAIL,
  REVIEW_DELETE_REQUEST,
  REVIEW_DELETE_RESET,
  REVIEW_DELETE_SUCCESS,
} from '../constants/reviewConstants';

export const reviewDetailsReducer = (state = { review: null }, action) => {
  switch (action.type) {
    case REVIEW_DETAILS_REQUEST:
      return {
        loading: true,
        review: state.review,
      };

    case REVIEW_DETAILS_SUCCESS:
      return {
        loading: false,
        review: action.payload,
      };

    case REVIEW_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case REVIEW_DETAILS_RESET:
      return {
        loading: false,
        review: null,
      };

    default:
      return state;
  }
};

export const reviewCreateReducer = (state = { review: null }, action) => {
  switch (action.type) {
    case REVIEW_CREATE_REQUEST:
      return {
        loading: true,
        review: null,
      };

    case REVIEW_CREATE_SUCCESS:
      return {
        loading: false,
        review: action.payload,
      };

    case REVIEW_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case REVIEW_CREATE_RESET:
      return {
        loading: false,
        review: null,
      };

    default:
      return state;
  }
};

export const reviewUpdateReducer = (state = { review: null }, action) => {
  switch (action.type) {
    case REVIEW_UPDATE_REQUEST:
      return {
        loading: true,
        review: null,
      };

    case REVIEW_UPDATE_SUCCESS:
      return {
        loading: false,
        review: action.payload,
      };

    case REVIEW_UPDATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case REVIEW_UPDATE_RESET:
      return {
        loading: false,
        review: null,
      };

    default:
      return state;
  }
};

export const reviewDeleteReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case REVIEW_DELETE_REQUEST:
      return {
        loading: true,
        success: false,
      };

    case REVIEW_DELETE_SUCCESS:
      return {
        loading: false,
        success: true,
      };

    case REVIEW_DELETE_FAIL:
      return {
        loading: false,
        error: action.payload,
        success: false,
      };

    case REVIEW_DELETE_RESET:
      return {
        loading: false,
        success: false,
      };

    default:
      return state;
  }
};
