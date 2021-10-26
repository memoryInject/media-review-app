import {
  REVIEW_DETAILS_FAIL,
  REVIEW_DETAILS_REQUEST,
  REVIEW_DETAILS_RESET,
  REVIEW_DETAILS_SUCCESS,
} from '../constants/reviewConstants';

export const reviewDetailsReducer = (state = { review: null }, action) => {
  switch (action.type) {
    case REVIEW_DETAILS_REQUEST:
      return {
        loading: true,
        review: null,
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
