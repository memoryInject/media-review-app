import {
  FEEDBACK_LIST_FAIL,
  FEEDBACK_LIST_REQUEST,
  FEEDBACK_LIST_RESET,
  FEEDBACK_LIST_SUCCESS,
  FEEDBACK_CREATE_REQUEST,
  FEEDBACK_CREATE_SUCCESS,
  FEEDBACK_CREATE_FAIL,
  FEEDBACK_CREATE_RESET,
  FEEDBACK_REPLY_REQUEST,
  FEEDBACK_REPLY_RESET,
  FEEDBACK_ACTIVE_REQUEST,
  FEEDBACK_ACTIVE_RESET,
  FEEDBACK_UPDATE_REQUEST,
  FEEDBACK_UPDATE_SUCCESS,
  FEEDBACK_UPDATE_FAIL,
  FEEDBACK_UPDATE_RESET,
  FEEDBACK_DELETE_REQUEST,
  FEEDBACK_DELETE_SUCCESS,
  FEEDBACK_DELETE_FAIL,
  FEEDBACK_DELETE_RESET,
  FEEDBACK_TO_UPDATE,
  FEEDBACK_TO_UPDATE_RESET,
  FEEDBACK_TO_DELETE_RESET,
  FEEDBACK_TO_DELETE,
  FEEDBACK_HEIGHT_SET,
  FEEDBACK_HEIGHT_RESET
} from '../constants/feedbackConstants';

export const feedbackListReducer = (
  state = { feedbacks: null, active: null, height: null },
  action
) => {
  switch (action.type) {
    case FEEDBACK_LIST_REQUEST:
      return { loading: true, feedbacks: null, active: state.active, height: state.height };

    case FEEDBACK_LIST_SUCCESS:
      return {
        loading: false,
        feedbacks: action.payload,
        active: state.active,
        height: state.height
      };

    case FEEDBACK_LIST_FAIL:
      return { loading: false, error: action.payload, height: state.height };

    case FEEDBACK_LIST_RESET:
      return { loading: false, feedbacks: null, active: null, height: state.height };

    case FEEDBACK_ACTIVE_REQUEST:
      return { ...state, active: action.payload };

    case FEEDBACK_ACTIVE_RESET:
      return { ...state, active: null };

    case FEEDBACK_HEIGHT_SET:
      return { ...state, height: action.payload }

    case FEEDBACK_HEIGHT_RESET:
      return { ...state, height: null }

    default:
      return state;
  }
};

export const feedbackCreateReducer = (
  state = { loading: false, feedback: null, reply: null, error: null },
  action
) => {
  switch (action.type) {
    case FEEDBACK_CREATE_REQUEST:
      return { loading: true, feedback: null };

    case FEEDBACK_CREATE_SUCCESS:
      return { loading: false, feedback: action.payload };

    case FEEDBACK_CREATE_FAIL:
      return { loading: false, error: action.payload };

    case FEEDBACK_CREATE_RESET:
      return { loading: false, feedback: null, reply: null, error: null };

    case FEEDBACK_REPLY_REQUEST:
      return { ...state, reply: action.payload };

    case FEEDBACK_REPLY_RESET:
      return { ...state, reply: null };

    default:
      return state;
  }
};

export const feedbackUpdateReducer = (
  state = { loading: false, feedback: null, update: null, error: null },
  action
) => {
  switch (action.type) {
    case FEEDBACK_UPDATE_REQUEST:
      return { loading: true, feedback: null, update: state.update };

    case FEEDBACK_UPDATE_SUCCESS:
      return { loading: false, feedback: action.payload, update: state.update };

    case FEEDBACK_UPDATE_FAIL:
      return { loading: false, error: action.payload, update: state.update };

    case FEEDBACK_UPDATE_RESET:
      return { loading: false, feedback: null, error: null, update: null };

    case FEEDBACK_TO_UPDATE:
      return { ...state, update: action.payload };

    case FEEDBACK_TO_UPDATE_RESET:
      return { ...state, update: null };

    default:
      return state;
  }
};

export const feedbackDeleteReducer = (
  state = { loading: false, success: false, delete: null, error: null },
  action
) => {
  switch (action.type) {
    case FEEDBACK_DELETE_REQUEST:
      return { loading: true, success: false, delete: state.delete };

    case FEEDBACK_DELETE_SUCCESS:
      return { loading: false, success: true, delete: state.delete };

    case FEEDBACK_DELETE_FAIL:
      return { loading: false, error: action.payload, delete: state.delete };

    case FEEDBACK_DELETE_RESET:
      return { loading: false, success: false, error: null, delete: null };

    case FEEDBACK_TO_DELETE:
      return { ...state, delete: action.payload };

    case FEEDBACK_TO_DELETE_RESET:
      return { ...state, delete: null };

    default:
      return state;
  }
};
