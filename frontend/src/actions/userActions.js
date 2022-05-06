import axios from 'axios';
import {
  PROJECT_DETAILS_RESET,
  PROJECT_LIST_RESET,
} from '../constants/projectConstants';
import { REVIEW_LIST_RESET } from '../constants/reviewConstants';
import {
  SEARCH_FILTER_PROJECT_COLLABORATED_RESET,
  SEARCH_FILTER_PROJECT_CREATED_RESET,
  SEARCH_FILTER_PROJECT_HIDE,
  SEARCH_FILTER_REVIEW_COLLABORATED_RESET,
  SEARCH_FILTER_REVIEW_CREATED_RESET,
  SEARCH_FILTER_REVIEW_HIDE,
  SEARCH_PROJECT_RESET,
  SEARCH_REVIEW_RESET,
} from '../constants/searchConstants';
import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_RESET,
  USER_DETAILS_SUCCESS,
  USER_UPDATE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_UPLOAD_IMAGE_REQUEST,
  USER_UPLOAD_IMAGE_SUCCESS,
  USER_UPLOAD_IMAGE_FAIL,
  USER_PASSWORD_RESET_EMAIL_REQUEST,
  USER_PASSWORD_RESET_EMAIL_SUCCESS,
  USER_PASSWORD_RESET_EMAIL_FAIL,
  USER_PASSWORD_RESET_CONFIRM_REQUEST,
  USER_PASSWORD_RESET_CONFIRM_SUCCESS,
  USER_PASSWORD_RESET_CONFIRM_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_INVITE_GET_EMAIL_REQUEST,
  USER_INVITE_GET_EMAIL_SUCCESS,
  USER_INVITE_GET_EMAIL_FAIL,
  USER_INVITE_ACCEPT_REQUEST,
  USER_INVITE_ACCEPT_SUCCESS,
  USER_INVITE_ACCEPT_FAIL,
} from '../constants/userConstants';
import { NOTIFICATION_LIST_CLEAR } from '../constants/notificationConstants';
import getError from '../utils/getError';

export const listUser =
  (username = '') =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: USER_LIST_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${userInfo.key}`,
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: '0',
        },
      };

      const { data } = await axios.get(
        `/api/v1/auth/users/?s=${username}`,
        config
      );

      dispatch({
        type: USER_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: USER_LIST_FAIL,
        payload: getError(error),
      });
    }
  };

export const getUserDetails = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${userInfo.key}`,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
      },
    };

    const { data } = await axios.get('/api/v1/auth/user/', config);

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: getError(error),
    });
  }
};

export const updateUser = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${userInfo.key}`,
      },
    };

    const { data } = await axios.patch('/api/v1/auth/user/', user, config);

    dispatch({
      type: USER_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload: getError(error),
    });
  }
};

export const uploadImageUser = (file) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPLOAD_IMAGE_REQUEST });

    const formData = new FormData();
    formData.append('image', file);

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Token ${userInfo.key}`,
      },
    };

    const { data } = await axios.post(
      '/api/v1/cloud/upload/image/',
      formData,
      config
    );

    dispatch({
      type: USER_UPLOAD_IMAGE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_UPLOAD_IMAGE_FAIL,
      payload: getError(error),
    });
  }
};

export const passwordResetEmailUser = (email) => async (dispatch) => {
  try {
    dispatch({ type: USER_PASSWORD_RESET_EMAIL_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    await axios.post('/api/v1/auth/password/reset/', { email }, config);

    dispatch({
      type: USER_PASSWORD_RESET_EMAIL_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: USER_PASSWORD_RESET_EMAIL_FAIL,
      payload: getError(error),
    });
  }
};

export const passwordResetConfirmUser = (data) => async (dispatch) => {
  try {
    dispatch({ type: USER_PASSWORD_RESET_CONFIRM_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    await axios.post('/api/v1/auth/password/reset/confirm/', data, config);

    dispatch({
      type: USER_PASSWORD_RESET_CONFIRM_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: USER_PASSWORD_RESET_CONFIRM_FAIL,
      payload: getError(error),
    });
  }
};

export const inviteGetEmailUser = (key) => async (dispatch) => {
  try {
    dispatch({ type: USER_INVITE_GET_EMAIL_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      '/api/v1/auth/accept/?email=true',
      { key },
      config
    );

    dispatch({
      type: USER_INVITE_GET_EMAIL_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_INVITE_GET_EMAIL_FAIL,
      payload: getError(error),
    });
  }
};

export const inviteAcceptUser = (data) => async (dispatch) => {
  try {
    dispatch({ type: USER_INVITE_ACCEPT_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    await axios.post('/api/v1/auth/accept/', data, config);

    dispatch({
      type: USER_INVITE_ACCEPT_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: USER_INVITE_ACCEPT_FAIL,
      payload: getError(error),
    });
  }
};

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      '/api/v1/auth/login/',
      { email, password },
      config
    );

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    dispatch(getUserDetails());
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: getError(error),
    });
  }
};

export const logout = () => (dispatch) => {
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_DETAILS_RESET });
  dispatch({ type: PROJECT_LIST_RESET });
  dispatch({ type: PROJECT_DETAILS_RESET });
  dispatch({ type: REVIEW_LIST_RESET });
  dispatch({ type: SEARCH_FILTER_PROJECT_HIDE });
  dispatch({ type: SEARCH_FILTER_REVIEW_HIDE });
  dispatch({ type: SEARCH_PROJECT_RESET });
  dispatch({ type: SEARCH_REVIEW_RESET });
  dispatch({ type: SEARCH_FILTER_PROJECT_CREATED_RESET });
  dispatch({ type: SEARCH_FILTER_REVIEW_CREATED_RESET });
  dispatch({ type: SEARCH_FILTER_PROJECT_COLLABORATED_RESET });
  dispatch({ type: SEARCH_FILTER_REVIEW_COLLABORATED_RESET });
  dispatch({ type: NOTIFICATION_LIST_CLEAR });
};
