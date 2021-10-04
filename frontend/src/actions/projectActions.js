import axios from 'axios';
import {
  PROJECT_LIST_REQUEST,
  PROJECT_LIST_SUCCESS,
  PROJECT_LIST_FAIL,
  PROJECT_DETAILS_REQUEST,
  PROJECT_DETAILS_SUCCESS,
  PROJECT_DETAILS_FAIL,
} from '../constants/projectConstants';
import getError from '../utils/getError';

export const listProjects = () => async (dispatch, getState) => {
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

    const { data } = await axios.get('/api/v1/review/projects/', config);

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

export const listProjectDetails = (id) => async (dispatch, getState) => {
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

    const { data } = await axios.get(`/api/v1/review/projects/${id}`, config);

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
