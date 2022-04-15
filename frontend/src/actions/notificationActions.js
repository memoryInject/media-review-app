import axios from 'axios';

import {
  NOTIFICATION_LIST_REQUEST,
  NOTIFICATION_LIST_SUCCESS,
  NOTIFICATION_LIST_FAIL,
} from '../constants/notificationConstants';
import getError from '../utils/getError';

export const listNotification =
  () =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: NOTIFICATION_LIST_REQUEST });


      const {
        userLogin: { userInfo },
      } = getState();

      let url = '/api/v1/messaging/notifications/';


      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${userInfo.key}`,
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: '0',
        },
      };

      const { data } = await axios.get(url, config);

      dispatch({
        type: NOTIFICATION_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: NOTIFICATION_LIST_FAIL,
        payload: getError(error),
      });
    }
  };
