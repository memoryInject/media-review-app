import axios from 'axios';
import {
  REVIEW_DETAILS_FAIL,
  REVIEW_DETAILS_REQUEST,
  REVIEW_DETAILS_SUCCESS,
  REVIEW_CREATE_FAIL,
  REVIEW_CREATE_REQUEST,
  REVIEW_CREATE_SUCCESS,
  REVIEW_UPDATE_FAIL,
  REVIEW_UPDATE_REQUEST,
  REVIEW_UPDATE_SUCCESS,
  REVIEW_DELETE_FAIL,
  REVIEW_DELETE_REQUEST,
  REVIEW_DELETE_SUCCESS,
} from '../constants/reviewConstants';
import getError from '../utils/getError';

export const listReviewDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: REVIEW_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${userInfo.key}`,
      },
    };

    const { data } = await axios.get(`/api/v1/review/reviews/${id}/`, config);

    dispatch({
      type: REVIEW_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: REVIEW_DETAILS_FAIL,
      payload: getError(error),
    });
  }
};

export const createReview = (review) => async (dispatch, getState) => {
  try {
    dispatch({ type: REVIEW_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const {
      userDetails: { user },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${userInfo.key}`,
      },
    };

    const { data } = await axios.post(
      '/api/v1/review/reviews/',
      { ...review, collaborators: [user.id] },
      config
    );

    dispatch({
      type: REVIEW_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: REVIEW_CREATE_FAIL,
      payload: getError(error),
    });
  }
};

export const updateReview = (id, review) => async (dispatch, getState) => {
  try {
    dispatch({ type: REVIEW_UPDATE_REQUEST });

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
      `/api/v1/review/reviews/${id}/`,
      review,
      config
    );

    dispatch({
      type: REVIEW_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: REVIEW_UPDATE_FAIL,
      payload: getError(error),
    });
  }
};

export const deleteReview = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: REVIEW_DELETE_REQUEST });

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
      `/api/v1/review/reviews/${id}/`,
      config
    );

    dispatch({
      type: REVIEW_DELETE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: REVIEW_DELETE_FAIL,
      payload: getError(error),
    });
  }
};
