import {
  PROJECT_DETAILS_FAIL,
  PROJECT_DETAILS_REQUEST,
  PROJECT_DETAILS_SUCCESS,
  PROJECT_LIST_FAIL,
  PROJECT_LIST_REQUEST,
  PROJECT_LIST_SUCCESS,
  PROJECT_CREATE_FAIL,
  PROJECT_CREATE_REQUEST,
  PROJECT_CREATE_SUCCESS,
  PROJECT_CREATE_RESET,
  PROJECT_UPLOAD_IMAGE_REQUEST,
  PROJECT_UPLOAD_IMAGE_SUCCESS,
  PROJECT_UPLOAD_IMAGE_FAIL,
  PROJECT_UPLOAD_IMAGE_RESET,
} from '../constants/projectConstants';

export const projectListReducer = (state = { projects: [] }, action) => {
  switch (action.type) {
    case PROJECT_LIST_REQUEST:
      return { loading: true, projects: [] };

    case PROJECT_LIST_SUCCESS:
      return { loading: false, projects: action.payload };

    case PROJECT_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const projectDetailsReducer = (state = { project: {} }, action) => {
  switch (action.type) {
    case PROJECT_DETAILS_REQUEST:
      return { loading: true, project: {} };

    case PROJECT_DETAILS_SUCCESS:
      return { loading: false, project: action.payload };

    case PROJECT_DETAILS_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const projectCreateReducer = (state = { project: null }, action) => {
  switch (action.type) {
    case PROJECT_CREATE_REQUEST:
      return { loading: true, project: null };

    case PROJECT_CREATE_SUCCESS:
      return { loading: false, project: action.payload };

    case PROJECT_CREATE_FAIL:
      return { loading: false, error: action.payload };

    case PROJECT_CREATE_RESET:
      return { project: null };

    default:
      return state;
  }
};

export const projectUploadImageReducer = (state = { image: null }, action) => {
  switch (action.type) {
    case PROJECT_UPLOAD_IMAGE_REQUEST:
      return { loading: true, image: null };

    case PROJECT_UPLOAD_IMAGE_SUCCESS:
      return { loading: false, image: action.payload };

    case PROJECT_UPLOAD_IMAGE_FAIL:
      return { loading: false, error: action.payload };

    case PROJECT_UPLOAD_IMAGE_RESET:
      return { image: null };

    default:
      return state;
  }
};
