import axios from 'axios';

import getError from '../utils/getError';
import {
  COLLABORATOR_LIST_GET,
  COLLABORATOR_UI_SHOW,
  COLLABORATOR_UI_HIDE,
  COLLABORATOR_USERS_FAIL,
  COLLABORATOR_USERS_REQUEST,
  COLLABORATOR_USERS_SUCCESS,
  COLLABORATOR_INVITATION_REQUEST,
  COLLABORATOR_INVITATION_SUCCESS,
  COLLABORATOR_INVITATION_FAIL,
  COLLABORATOR_DETAILS_GET,
} from '../constants/collaboratorConstants';

export const showUICollaborator = () => {
  return {type: COLLABORATOR_UI_SHOW}
}

export const hideUICollaborator = () => {
  return {type: COLLABORATOR_UI_HIDE}
}

export const listCollaborator = () => (dispatch, getState) => {
  const {
    reviewDetails: {
      review: { collaborators },
    },
  } = getState();

  dispatch({
    type: COLLABORATOR_LIST_GET,
    payload: collaborators,
  });
};

export const detailsCollaborator = (collaborator) => {
  return {
    type: COLLABORATOR_DETAILS_GET,
    payload: collaborator,
  };
};

export const usersCollaborator =
  (username = '') =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: COLLABORATOR_USERS_REQUEST });

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
        `/api/v1/auth/users/?s=${username}`,
        config
      );

      dispatch({
        type: COLLABORATOR_USERS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: COLLABORATOR_USERS_FAIL,
        payload: getError(error),
      });
    }
  };

export const invitationCollaborator =
  (email) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: COLLABORATOR_INVITATION_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${userInfo.key}`,
        },
      };
        
      await axios.post('/api/v1/auth/invite/', { email }, config);

      dispatch({
        type: COLLABORATOR_INVITATION_SUCCESS
      });
    } catch (error) {
      dispatch({
        type: COLLABORATOR_INVITATION_FAIL,
        payload: getError(error),
      });
    }
  };
