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
  COLLABORATOR_ADD_REQUEST,
  COLLABORATOR_ADD_SUCCESS,
  COLLABORATOR_ADD_FAIL,
  COLLABORATOR_REMOVE_REQUEST,
  COLLABORATOR_REMOVE_SUCCESS,
  COLLABORATOR_REMOVE_FAIL,
  COLLABORATOR_DETAILS_GET,
} from '../constants/collaboratorConstants';

export const showUICollaborator = () => {
  return { type: COLLABORATOR_UI_SHOW };
};

export const hideUICollaborator = () => {
  return { type: COLLABORATOR_UI_HIDE };
};

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

export const invitationCollaborator = (email) => async (dispatch, getState) => {
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
      type: COLLABORATOR_INVITATION_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: COLLABORATOR_INVITATION_FAIL,
      payload: getError(error),
    });
  }
};

export const addCollaborator = (users) => async (dispatch, getState) => {
  try {
    dispatch({ type: COLLABORATOR_ADD_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const {
      reviewDetails: {
        review: { id, collaborators },
      },
    } = getState();

    const existingCollaboratorIds = collaborators.map((collab) => collab.id);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${userInfo.key}`,
      },
    };

    await axios.patch(
      `/api/v1/review/reviews/${id}/`,
      { collaborators: [...existingCollaboratorIds, ...users] },
      config
    );

    dispatch({
      type: COLLABORATOR_ADD_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: COLLABORATOR_ADD_FAIL,
      payload: getError(error),
    });
  }
};

export const removeCollaborator = () => async (dispatch, getState) => {
  try {
    dispatch({ type: COLLABORATOR_REMOVE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const {
      reviewDetails: {
        review: { id, collaborators },
      },
    } = getState();

    const {
      collaboratorRemove: { collaboratorToRemove },
    } = getState();

    const existingCollaboratorIds = collaborators.map((collab) => collab.id);
    const filterCollaborators = existingCollaboratorIds.filter(
      (c) => c !== collaboratorToRemove
    );

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${userInfo.key}`,
      },
    };

    await axios.patch(
      `/api/v1/review/reviews/${id}/`,
      { collaborators: [...filterCollaborators] },
      config
    );

    dispatch({
      type: COLLABORATOR_REMOVE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: COLLABORATOR_REMOVE_FAIL,
      payload: getError(error),
    });
  }
};
