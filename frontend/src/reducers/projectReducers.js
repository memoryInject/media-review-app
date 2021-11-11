import {
  PROJECT_DETAILS_FAIL,
  PROJECT_DETAILS_REQUEST,
  PROJECT_DETAILS_SUCCESS,
  PROJECT_DETAILS_RESET,
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
  PROJECT_UPDATE_REQUEST,
  PROJECT_UPDATE_SUCCESS,
  PROJECT_UPDATE_FAIL,
  PROJECT_UPDATE_RESET,
  PROJECT_DELETE_REQUEST,
  PROJECT_DELETE_SUCCESS,
  PROJECT_DELETE_FAIL,
  PROJECT_DELETE_RESET,
  PROJECT_LIST_RESET,
} from '../constants/projectConstants';

export const projectListReducer = (state = { projects: null }, action) => {
  switch (action.type) {
    case PROJECT_LIST_REQUEST:
      return { loading: true, projects: state.projects};

    case PROJECT_LIST_SUCCESS:
      return { loading: false, projects: action.payload };

    case PROJECT_LIST_FAIL:
      return { loading: false, error: action.payload, projects: null };

    case PROJECT_LIST_RESET:
      return { loading: false, projects: null };

    default:
      return state;
  }
};

export const projectDetailsReducer = (state = { project: null }, action) => {
  switch (action.type) {
    case PROJECT_DETAILS_REQUEST:
      return { loading: true, project: state.project };

    case PROJECT_DETAILS_SUCCESS:
      return { loading: false, project: action.payload };

    case PROJECT_DETAILS_FAIL:
      return { loading: false, error: action.payload, project: null };

    case PROJECT_DETAILS_RESET:
      return { project: null };

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

export const projectUpdateReducer = (state = { project: null }, action) => {
  switch (action.type) {
    case PROJECT_UPDATE_REQUEST:
      return { loading: true, project: null };

    case PROJECT_UPDATE_SUCCESS:
      return { loading: false, project: action.payload };

    case PROJECT_UPDATE_FAIL:
      return { loading: false, error: action.payload };

    case PROJECT_UPDATE_RESET:
      return { project: null };

    default:
      return state;
  }
};

export const projectDeleteReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case PROJECT_DELETE_REQUEST:
      return { loading: true, success: false };

    case PROJECT_DELETE_SUCCESS:
      return { loading: false, success: true};

    case PROJECT_DELETE_FAIL:
      return { loading: false, error: action.payload, success: false };

    case PROJECT_DELETE_RESET:
      return { success: false };

    default:
      return state;
  }
};
