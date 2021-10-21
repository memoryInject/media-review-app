const { default: axios } = require('axios');
const {
  FEEDBACK_LIST_REQUEST,
  FEEDBACK_LIST_SUCCESS,
  FEEDBACK_LIST_FAIL,
  FEEDBACK_CREATE_REQUEST,
  FEEDBACK_CREATE_SUCCESS,
  FEEDBACK_CREATE_FAIL,
  FEEDBACK_REPLY_REQUEST,
  FEEDBACK_ACTIVE_REQUEST,
  FEEDBACK_UPDATE_REQUEST,
  FEEDBACK_UPDATE_SUCCESS,
  FEEDBACK_UPDATE_FAIL,
  FEEDBACK_DELETE_REQUEST,
  FEEDBACK_DELETE_SUCCESS,
  FEEDBACK_DELETE_FAIL,
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

export const updateFeedback = (id, feedback) => async (dispatch, getState) => {
  try {
    dispatch({ type: FEEDBACK_UPDATE_REQUEST });

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
      `/api/v1/review/feedbacks/${id}/`,
      feedback,
      config
    );

    dispatch({
      type: FEEDBACK_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FEEDBACK_UPDATE_FAIL,
      payload: getError(error),
    });
  }
};

export const deleteFeedback = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: FEEDBACK_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${userInfo.key}`,
      },
    };

    await axios.delete(`/api/v1/review/feedbacks/${id}/`, config);

    dispatch({
      type: FEEDBACK_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: FEEDBACK_DELETE_FAIL,
      payload: getError(error),
    });
  }
};

export const replyFeedback = (feedbackToReplay) => {
  return { type: FEEDBACK_REPLY_REQUEST, payload: feedbackToReplay };
};

export const activeFeedback = (feedback) => {
  return { type: FEEDBACK_ACTIVE_REQUEST, payload: feedback };
};
