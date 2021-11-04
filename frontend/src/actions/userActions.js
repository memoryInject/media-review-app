import axios from 'axios';
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
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
} from '../constants/userConstants';
import getError from '../utils/getError';

export const listUser  =
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

export const passwordResetEmailUser = (email) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_PASSWORD_RESET_EMAIL_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${userInfo.key}`,
      },
    };

    await axios.post(
      '/api/v1/auth/password/reset/',
      { email },
      config
    );

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
};
