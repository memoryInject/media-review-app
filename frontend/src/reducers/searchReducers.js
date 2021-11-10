import {
  SEARCH_PROJECT_NAME,
  SEARCH_PROJECT_RESET,
  SEARCH_FILTER_PROJECT_SHOW,
  SEARCH_FILTER_PROJECT_HIDE,
  SEARCH_FILTER_PROJECT_CREATED,
  SEARCH_FILTER_PROJECT_CREATED_RESET,
  SEARCH_FILTER_PROJECT_COLLABORATED,
  SEARCH_FILTER_PROJECT_COLLABORATED_RESET,
  SEARCH_REVIEW_NAME,
  SEARCH_REVIEW_RESET,
  SEARCH_FILTER_REVIEW_SHOW,
  SEARCH_FILTER_REVIEW_HIDE,
  SEARCH_FILTER_REVIEW_CREATED,
  SEARCH_FILTER_REVIEW_CREATED_RESET,
  SEARCH_FILTER_REVIEW_COLLABORATED,
  SEARCH_FILTER_REVIEW_COLLABORATED_RESET,
} from '../constants/searchConstants';

export const searchProjectReducer = (state = { keyword: '' }, action) => {
  switch (action.type) {
    case SEARCH_PROJECT_NAME:
      return { ...state, keyword: action.payload };

    case SEARCH_PROJECT_RESET:
      return { keyword: '' };

    default:
      return state;
  }
};

export const searchReviewReducer = (state = { keyword: '' }, action) => {
  switch (action.type) {
    case SEARCH_REVIEW_NAME:
      return { ...state, keyword: action.payload };

    case SEARCH_REVIEW_RESET:
      return { keyword: '' };

    default:
      return state;
  }
};

export const searchFilterProjectReducer = (
  state = { show: false, created: false, collaborated: false },
  action
) => {
  switch (action.type) {
    case SEARCH_FILTER_PROJECT_SHOW:
      return { ...state, show: action.payload };

    case SEARCH_FILTER_PROJECT_HIDE:
      return { ...state, show: false };

    case SEARCH_FILTER_PROJECT_CREATED:
      return { ...state, created: action.payload };

    case SEARCH_FILTER_PROJECT_CREATED_RESET:
      return { ...state, created: false };

    case SEARCH_FILTER_PROJECT_COLLABORATED:
      return { ...state, collaborated: action.payload };

    case SEARCH_FILTER_PROJECT_COLLABORATED_RESET:
      return { ...state, collaborated: false };

    default:
      return state;
  }
};

export const searchFilterReviewReducer = (
  state = { show: false, created: false, collaborated: false },
  action
) => {
  switch (action.type) {
    case SEARCH_FILTER_REVIEW_SHOW:
      return { ...state, show: action.payload };

    case SEARCH_FILTER_REVIEW_HIDE:
      return { ...state, show: false };

    case SEARCH_FILTER_REVIEW_CREATED:
      return { ...state, created: action.payload };

    case SEARCH_FILTER_REVIEW_CREATED_RESET:
      return { ...state, created: false };

    case SEARCH_FILTER_REVIEW_COLLABORATED:
      return { ...state, collaborated: action.payload };

    case SEARCH_FILTER_REVIEW_COLLABORATED_RESET:
      return { ...state, collaborated: false };

    default:
      return state;
  }
};
