import axios from "axios";
import {REVIEW_DETAILS_FAIL, REVIEW_DETAILS_REQUEST, REVIEW_DETAILS_SUCCESS} from "../constants/reviewConstants";
import getError from "../utils/getError";

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

    const { data } = await axios.get(`/api/v1/review/reviews/${id}`, config);

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
