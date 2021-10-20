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
} from '../constants/feedbackConstants';

export const feedbackListReducer = (state = { feedbacks: null, active: null }, action) => {
  switch (action.type) {
    case FEEDBACK_LIST_REQUEST:
      return { loading: true, feedbacks: null , active: state.active};

    case FEEDBACK_LIST_SUCCESS:
      return { loading: false, feedbacks: action.payload, active: state.active };

    case FEEDBACK_LIST_FAIL:
      return { loading: false, error: action.payload };

    case FEEDBACK_LIST_RESET:
      return { loading: false, feedbacks: null, active: null };

    case FEEDBACK_ACTIVE_REQUEST:
      return {...state, active: action.payload}

    case FEEDBACK_ACTIVE_RESET:
      return {...state, active: null}

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
