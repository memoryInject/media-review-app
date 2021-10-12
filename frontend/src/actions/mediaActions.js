import axios from 'axios';
import {
  MEDIA_DETAILS_FAIL,
  MEDIA_DETAILS_REQUEST,
  MEDIA_DETAILS_SUCCESS,
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
