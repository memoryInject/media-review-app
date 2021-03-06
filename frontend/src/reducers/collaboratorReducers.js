import {
  COLLABORATOR_UI_SHOW,
  COLLABORATOR_UI_HIDE,
  COLLABORATOR_LIST_REQUEST,
  COLLABORATOR_LIST_SUCCESS,
  COLLABORATOR_LIST_FAIL,
  COLLABORATOR_LIST_RESET,
  COLLABORATOR_DETAILS_GET,
  COLLABORATOR_USERS_REQUEST,
  COLLABORATOR_USERS_SUCCESS,
  COLLABORATOR_USERS_FAIL,
  COLLABORATOR_INVITATION_REQUEST,
  COLLABORATOR_INVITATION_SUCCESS,
  COLLABORATOR_INVITATION_FAIL,
  COLLABORATOR_ADD_REQUEST,
  COLLABORATOR_ADD_SUCCESS,
  COLLABORATOR_ADD_FAIL,
  COLLABORATOR_ADD_RESET,
  COLLABORATOR_REMOVE_REQUEST,
  COLLABORATOR_REMOVE_SUCCESS,
  COLLABORATOR_REMOVE_FAIL,
  COLLABORATOR_REMOVE_RESET,
  COLLABORATOR_DETAILS_RESET,
  COLLABORATOR_INVITATION_RESET,
  COLLABORATOR_REMOVE_USER,
} from '../constants/collaboratorConstants';

export const collaboratorUIReducer = (state = { showUI: false }, action) => {
  switch (action.type) {
    case COLLABORATOR_UI_SHOW:
      return { showUI: true };

    case COLLABORATOR_UI_HIDE:
      return { showUI: false };

    default:
      return state;
  }
};

export const collaboratorListReducer = (
  state = { collaborators: null, reviewId: null },
  action
) => {
  switch (action.type) {
    case COLLABORATOR_LIST_REQUEST:
      return {
        loading: true,
        collaborators: state.collaborators,
        reviewId: state.reviewId,
      };

    case COLLABORATOR_LIST_SUCCESS:
      return {
        loading: false,
        collaborators: action.payload.collaborators,
        reviewId: action.payload.id,
      };

    case COLLABORATOR_LIST_FAIL:
      return {
        loading: false,
        collaborators: null,
        error: action.payload,
        reviewId: null,
      };

    case COLLABORATOR_LIST_RESET:
      return { collaborators: null, reviewId: null };

    default:
      return state;
  }
};

export const collaboratorDetailsReducer = (
  state = { collaborator: null },
  action
) => {
  switch (action.type) {
    case COLLABORATOR_DETAILS_GET:
      return { collaborator: action.payload };

    case COLLABORATOR_DETAILS_RESET:
      return { collaborator: null };

    default:
      return state;
  }
};

export const collaboratorUsersReducer = (
  state = { loading: false, users: null, error: null },
  action
) => {
  switch (action.type) {
    case COLLABORATOR_USERS_REQUEST:
      return { loading: true, users: null, error: null };

    case COLLABORATOR_USERS_SUCCESS:
      return { loading: false, users: action.payload };

    case COLLABORATOR_USERS_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const collaboratorInvitationReducer = (
  state = { loading: false, success: false, error: null },
  action
) => {
  switch (action.type) {
    case COLLABORATOR_INVITATION_REQUEST:
      return { loading: true, success: false, error: null };

    case COLLABORATOR_INVITATION_SUCCESS:
      return { loading: false, success: true };

    case COLLABORATOR_INVITATION_FAIL:
      return { loading: false, error: action.payload, success: false };

    case COLLABORATOR_INVITATION_RESET:
      return { loading: false, error: null, success: false };

    default:
      return state;
  }
};

export const collaboratorAddReducer = (
  state = { loading: false, success: false, error: null },
  action
) => {
  switch (action.type) {
    case COLLABORATOR_ADD_REQUEST:
      return { loading: true, success: false, error: null };

    case COLLABORATOR_ADD_SUCCESS:
      return { loading: false, success: true };

    case COLLABORATOR_ADD_FAIL:
      return { loading: false, error: action.payload, success: false };

    case COLLABORATOR_ADD_RESET:
      return { loading: false, error: null, success: false };

    default:
      return state;
  }
};

export const collaboratorRemoveReducer = (
  state = {
    loading: false,
    success: false,
    error: null,
    collaboratorToRemove: null,
  },
  action
) => {
  switch (action.type) {
    case COLLABORATOR_REMOVE_REQUEST:
      return { ...state, loading: true, success: false, error: null };

    case COLLABORATOR_REMOVE_SUCCESS:
      return { ...state, loading: false, success: true };

    case COLLABORATOR_REMOVE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };

    case COLLABORATOR_REMOVE_RESET:
      return {
        loading: false,
        error: null,
        success: false,
        collaboratorToRemove: null,
      };

    case COLLABORATOR_REMOVE_USER:
      return { ...state, collaboratorToRemove: action.payload };

    default:
      return state;
  }
};
