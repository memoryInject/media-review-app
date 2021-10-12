const { default: axios } = require('axios');
const {
  FEEDBACK_LIST_REQUEST,
  FEEDBACK_LIST_SUCCESS,
  FEEDBACK_LIST_FAIL,
  FEEDBACK_CREATE_REQUEST,
  FEEDBACK_CREATE_SUCCESS,
  FEEDBACK_CREATE_FAIL,
} = require('../constants/feedbackConstants');
const { default: getError } = require('../utils/getError');

export const listFeedbacks = (mediaId) => async (dispatch, getState) => {
  try {
    dispatch({ type: FEEDBACK_LIST_REQUEST });

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
      `/api/v1/review/feedbacks/?media=${mediaId}`,
      config
    );

    dispatch({
      type: FEEDBACK_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FEEDBACK_LIST_FAIL,
      payload: getError(error),
    });
  }
};

export const createFeedback = (feedback) => async (dispatch, getState) => {
  try {
    dispatch({ type: FEEDBACK_CREATE_REQUEST });

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
      '/api/v1/review/feedbacks/',
      feedback,
      config
    );

    dispatch({
      type: FEEDBACK_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FEEDBACK_CREATE_FAIL,
      payload: getError(error),
    });
  }
};
