import axios from 'axios';
import {
  PROJECT_LIST_REQUEST,
  PROJECT_LIST_SUCCESS,
  PROJECT_LIST_FAIL,
  PROJECT_DETAILS_REQUEST,
  PROJECT_DETAILS_SUCCESS,
  PROJECT_DETAILS_FAIL,
  PROJECT_CREATE_REQUEST,
  PROJECT_CREATE_SUCCESS,
  PROJECT_CREATE_FAIL,
  PROJECT_UPLOAD_IMAGE_REQUEST,
  PROJECT_UPLOAD_IMAGE_SUCCESS,
  PROJECT_UPLOAD_IMAGE_FAIL,
  PROJECT_UPDATE_REQUEST,
  PROJECT_UPDATE_SUCCESS,
  PROJECT_UPDATE_FAIL,
  PROJECT_DELETE_REQUEST,
  PROJECT_DELETE_FAIL,
  PROJECT_DELETE_SUCCESS,
} from '../constants/projectConstants';
import getError from '../utils/getError';

export const listProjects =
  (search = '') =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: PROJECT_LIST_REQUEST });

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
        `/api/v1/review/projects/?s=${search}`,
        config
      );

      dispatch({
        type: PROJECT_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PROJECT_LIST_FAIL,
        payload: getError(error),
      });
    }
  };

export const listProjectDetails =
  (id, search = '') =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: PROJECT_DETAILS_REQUEST });

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
        `/api/v1/review/projects/${id}/?s=${search}`,
        config
      );

      dispatch({
        type: PROJECT_DETAILS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PROJECT_DETAILS_FAIL,
        payload: getError(error),
      });
    }
  };

export const createProject = (project) => async (dispatch, getState) => {
  try {
    dispatch({ type: PROJECT_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${userInfo.key}`,
      },
    };

    const { data } = await axios.post(
      '/api/v1/review/projects/',
      project,
      config
    );

    dispatch({
      type: PROJECT_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PROJECT_CREATE_FAIL,
      payload: getError(error),
    });
  }
};

export const uploadImageProject = (file) => async (dispatch, getState) => {
  try {
    dispatch({ type: PROJECT_UPLOAD_IMAGE_REQUEST });

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
      type: PROJECT_UPLOAD_IMAGE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PROJECT_UPLOAD_IMAGE_FAIL,
      payload: getError(error),
    });
  }
};

export const updateProject = (id, project) => async (dispatch, getState) => {
  try {
    dispatch({ type: PROJECT_UPDATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${userInfo.key}`,
      },
    };

    const { data } = await axios.patch(
      `/api/v1/review/projects/${id}/`,
      project,
      config
    );

    dispatch({
      type: PROJECT_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PROJECT_UPDATE_FAIL,
      payload: getError(error),
    });
  }
};

export const deleteProject = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: PROJECT_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${userInfo.key}`,
      },
    };

    const { data } = await axios.delete(
      `/api/v1/review/projects/${id}/`,
      config
    );

    dispatch({
      type: PROJECT_DELETE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PROJECT_DELETE_FAIL,
      payload: getError(error),
    });
  }
};
