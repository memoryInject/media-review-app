import axios from 'axios';
import {
  MEDIA_CREATE_FAIL,
  MEDIA_CREATE_REQUEST,
  MEDIA_CREATE_SUCCESS,
  MEDIA_DETAILS_FAIL,
  MEDIA_DETAILS_REQUEST,
  MEDIA_DETAILS_SUCCESS,
  MEDIA_UPDATE_FAIL,
  MEDIA_UPDATE_REQUEST,
  MEDIA_UPDATE_SUCCESS,
  MEDIA_DELETE_FAIL,
  MEDIA_DELETE_REQUEST,
  MEDIA_DELETE_SUCCESS,
} from '../constants/mediaConstants';
import getError from '../utils/getError';

export const listMediaDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: MEDIA_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${userInfo.key}`,
      },
    };

    const { data } = await axios.get(`/api/v1/review/media/${id}/`, config);

    dispatch({
      type: MEDIA_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MEDIA_DETAILS_FAIL,
      payload: getError(error),
    });
  }
};

export const createMedia = (media) => async (dispatch, getState) => {
  try {
    dispatch({ type: MEDIA_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${userInfo.key}`,
      },
    };

    const { data } = await axios.post('/api/v1/review/media/', media, config);

    dispatch({
      type: MEDIA_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MEDIA_CREATE_FAIL,
      payload: getError(error),
    });
  }
};

export const updateMedia = (id, media) => async (dispatch, getState) => {
  try {
    dispatch({ type: MEDIA_UPDATE_REQUEST });

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
      `/api/v1/review/media/${id}/`,
      media,
      config
    );

    dispatch({
      type: MEDIA_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MEDIA_UPDATE_FAIL,
      payload: getError(error),
    });
  }
};

export const deleteMedia = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: MEDIA_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${userInfo.key}`,
      },
    };

    await axios.delete(`/api/v1/review/media/${id}/`, config);

    dispatch({
      type: MEDIA_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: MEDIA_DELETE_FAIL,
      payload: getError(error),
    });
  }
};
