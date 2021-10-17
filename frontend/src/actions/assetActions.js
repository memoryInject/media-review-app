import axios from 'axios'
import getError from '../utils/getError'

import {
  ASSET_CREATE_REQUEST,
  ASSET_CREATE_SUCCESS,
  ASSET_CREATE_FAIL,
} from '../constants/assetConstants';

export const createAsset = (asset) => async (dispatch, getState) => {
  try {
    dispatch({ type: ASSET_CREATE_REQUEST });

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
      '/api/v1/review/assets/',
      asset,
      config
    );

    dispatch({
      type: ASSET_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ASSET_CREATE_FAIL,
      payload: getError(error),
    });
  }
};
