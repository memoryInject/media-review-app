import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_RESET,
  USER_DETAILS_SUCCESS,
  USER_UPDATE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_RESET,
  USER_UPDATE_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_UPLOAD_IMAGE_REQUEST,
  USER_UPLOAD_IMAGE_SUCCESS,
  USER_UPLOAD_IMAGE_FAIL,
  USER_UPLOAD_IMAGE_RESET,
  USER_PASSWORD_RESET_EMAIL_REQUEST,
  USER_PASSWORD_RESET_EMAIL_SUCCESS,
  USER_PASSWORD_RESET_EMAIL_FAIL,
  USER_PASSWORD_RESET_EMAIL_RESET,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
} from '../constants/userConstants';

export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };

    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload };

    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload };

    case USER_LOGOUT:
      return {};

    default:
      return state;
  }
};

export const userListReducer = (state = { users: null }, action) => {
  switch (action.type) {
    case USER_LIST_REQUEST:
      return { ...state, loading: true };

    case USER_LIST_SUCCESS:
      return { loading: false, users: action.payload };

    case USER_LIST_FAIL:
      return { loading: false, error: action.payload };

    case USER_LIST_RESET:
      return { users: null };

    default:
      return state;
  }
};

export const userDetailsReducer = (state = { user: null }, action) => {
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      return { ...state, loading: true };

    case USER_DETAILS_SUCCESS:
      return { loading: false, user: action.payload };

    case USER_DETAILS_FAIL:
      return { loading: false, error: action.payload };

    case USER_DETAILS_RESET:
      return { user: null };

    default:
      return state;
  }
};

export const userUpdateReducer = (state = { user: null }, action) => {
  switch (action.type) {
    case USER_UPDATE_REQUEST:
      return { ...state, loading: true };

    case USER_UPDATE_SUCCESS:
      return { loading: false, user: action.payload };

    case USER_UPDATE_FAIL:
      return { loading: false, error: action.payload };

    case USER_UPDATE_RESET:
      return { user: null };

    default:
      return state;
  }
};

export const userUploadImageReducer = (state = { image: null }, action) => {
  switch (action.type) {
    case USER_UPLOAD_IMAGE_REQUEST:
      return { loading: true, image: null };

    case USER_UPLOAD_IMAGE_SUCCESS:
      return { loading: false, image: action.payload };

    case USER_UPLOAD_IMAGE_FAIL:
      return { loading: false, error: action.payload };

    case USER_UPLOAD_IMAGE_RESET:
      return { image: null };

    default:
      return state;
  }
};

export const userPasswordResetEmailReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case USER_PASSWORD_RESET_EMAIL_REQUEST:
      return { ...state, loading: true };

    case USER_PASSWORD_RESET_EMAIL_SUCCESS:
      return { loading: false, success: true};

    case USER_PASSWORD_RESET_EMAIL_FAIL:
      return { loading: false, error: action.payload };

    case USER_PASSWORD_RESET_EMAIL_RESET:
      return { success: false };

    default:
      return state;
  }
};
