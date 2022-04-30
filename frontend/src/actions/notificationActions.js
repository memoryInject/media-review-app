import axios from 'axios';

import {
  NOTIFICATION_LIST_REQUEST,
  NOTIFICATION_LIST_SUCCESS,
  NOTIFICATION_LIST_FAIL,
  NOTIFICATIONS_DELETE_SUCCESS,
  NOTIFICATIONS_DELETE_REQUEST,
  NOTIFICATIONS_DELETE_FAIL,
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

export const deleteNotifications =
  () =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: NOTIFICATIONS_DELETE_REQUEST });


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

      await axios.delete(url, config);

      dispatch({
        type: NOTIFICATIONS_DELETE_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: NOTIFICATIONS_DELETE_FAIL,
        payload: getError(error),
      });
    }
  };
