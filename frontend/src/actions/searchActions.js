import {
  SEARCH_FILTER_PROJECT_COLLABORATED,
  SEARCH_FILTER_PROJECT_COLLABORATED_RESET,
  SEARCH_FILTER_PROJECT_CREATED,
  SEARCH_FILTER_PROJECT_CREATED_RESET,
  SEARCH_FILTER_PROJECT_HIDE,
  SEARCH_FILTER_PROJECT_SHOW,
  SEARCH_FILTER_REVIEW_COLLABORATED,
  SEARCH_FILTER_REVIEW_COLLABORATED_RESET,
  SEARCH_FILTER_REVIEW_CREATED,
  SEARCH_FILTER_REVIEW_CREATED_RESET,
  SEARCH_FILTER_REVIEW_HIDE,
  SEARCH_FILTER_REVIEW_SHOW,
  SEARCH_PROJECT_NAME,
  SEARCH_PROJECT_RESET,
  SEARCH_REVIEW_NAME,
  SEARCH_REVIEW_RESET,
} from '../constants/searchConstants';

export const projectSearch = (name) => {
  return { type: SEARCH_PROJECT_NAME, payload: name };
};

export const projectSearchReset = () => {
  return { type: SEARCH_PROJECT_RESET };
};

export const reviewSearch = (name) => {
  return { type: SEARCH_REVIEW_NAME, payload: name };
};

export const reviewSearchReset = () => {
  return { type: SEARCH_REVIEW_RESET };
};

export const projectSearchFilterShow = (state) => {
  return { type: SEARCH_FILTER_PROJECT_SHOW, payload: state };
};

export const projectSearchFilterHide = () => {
  return { type: SEARCH_FILTER_PROJECT_HIDE };
};

export const reviewSearchFilterShow = (state) => {
  return { type: SEARCH_FILTER_REVIEW_SHOW, payload: state};
};

export const reviewSearchFilterHide = () => {
  return { type: SEARCH_FILTER_REVIEW_HIDE };
};

export const projectSearchFilterCreated = (state) => {
  return { type: SEARCH_FILTER_PROJECT_CREATED, payload: state};
};

export const projectSearchFilterCreatedReset = () => {
  return { type: SEARCH_FILTER_PROJECT_CREATED_RESET };
};

export const reviewSearchFilterCreated = (state) => {
  return { type: SEARCH_FILTER_REVIEW_CREATED, payload: state };
};

export const reviewSearchFilterCreatedReset = () => {
  return { type: SEARCH_FILTER_REVIEW_CREATED_RESET };
};

export const projectSearchFilterCollaborated = (state) => {
  return { type: SEARCH_FILTER_PROJECT_COLLABORATED, payload: state };
};

export const projectSearchFilterCollaboratedReset = () => {
  return { type: SEARCH_FILTER_PROJECT_COLLABORATED_RESET };
};

export const reviewSearchFilterCollaborated = (state) => {
  return { type: SEARCH_FILTER_REVIEW_COLLABORATED, payload: state };
};

export const reviewSearchFilterCollaboratedReset = () => {
  return { type: SEARCH_FILTER_REVIEW_COLLABORATED_RESET };
};
