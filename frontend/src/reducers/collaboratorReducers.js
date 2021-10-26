import {
  COLLABORATOR_UI_SHOW,
  COLLABORATOR_UI_HIDE,
  COLLABORATOR_LIST_GET,
  COLLABORATOR_LIST_RESET,
  COLLABORATOR_USERS_REQUEST,
  COLLABORATOR_USERS_SUCCESS,
  COLLABORATOR_USERS_FAIL,
  COLLABORATOR_INVITATION_REQUEST,
  COLLABORATOR_INVITATION_SUCCESS,
  COLLABORATOR_INVITATION_FAIL,
  COLLABORATOR_DETAILS_GET,
  COLLABORATOR_DETAILS_RESET,
} from '../constants/collaboratorConstants';

export const collaboratorUIReducer = (state = {showUI: false}, action) => {
  switch (action.type) {
    case COLLABORATOR_UI_SHOW:
      return { showUI: true };

    case COLLABORATOR_UI_HIDE:
      return { showUI: false };

    default:
      return state;
}
}

export const collaboratorListReducer = (
  state = { collaborators: null, },
  action
) => {
  switch (action.type) {

    case COLLABORATOR_LIST_GET:
      return { collaborators: action.payload };

    case COLLABORATOR_LIST_RESET:
      return { collaborators: null, };

    default:
      return state;
  }
};

export const collaboratorDetailsReducer = (
  state = { collaborator: null, },
  action
) => {
  switch (action.type) {

    case COLLABORATOR_DETAILS_GET:
      return { collaborator: action.payload };

    case COLLABORATOR_DETAILS_RESET:
      return { collaborator: null, };

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

    default:
      return state;
  }
};
