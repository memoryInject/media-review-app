import {
  NOTIFICATIONS_DELETE_FAIL,
  NOTIFICATIONS_DELETE_REQUEST,
  NOTIFICATIONS_DELETE_RESET,
  NOTIFICATIONS_DELETE_SUCCESS,
  NOTIFICATION_ADD,
  NOTIFICATION_LIST_CLEAR,
  NOTIFICATION_LIST_FAIL,
  NOTIFICATION_LIST_REQUEST,
  NOTIFICATION_LIST_RESET,
  NOTIFICATION_LIST_SUCCESS,
} from '../constants/notificationConstants';

export const notificationListReducer = (
  state = { notifications: [], loading: false, error: null, success: false },
  action
) => {
  switch (action.type) {
    case NOTIFICATION_LIST_REQUEST:
      return {
        loading: true,
        error: null,
        success: false,
        notifications: state.notifications,
      };

    case NOTIFICATION_LIST_SUCCESS:
      const payload = action.payload.results;
      // Get difference
      const filteredPayload = payload.filter(
        (p) => !state.notifications.some((n) => p.id === n.id)
      );
      return {
        loading: false,
        error: null,
        success: true,
        notifications: [...state.notifications, ...filteredPayload],
      };

    case NOTIFICATION_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
        success: false,
        notifications: state.notifications,
      };

    case NOTIFICATION_LIST_RESET:
      return {
        loading: false,
        error: null,
        success: false,
        notifications: state.notifications,
      };

    case NOTIFICATION_LIST_CLEAR:
      return {
        loading: false,
        error: null,
        success: false,
        notifications: [],
      };

    case NOTIFICATION_ADD:
      let filtered = state.notifications.filter(n => n.id === action.payload.id)
      let newPayload = filtered.length ? [] : [action.payload]
      return {
        loading: false,
        error: null,
        success: state.success,
        notifications: [...newPayload, ...state.notifications],
      };

    default:
      return state;
  }
};

export const notificationsDeleteReducer = (
  state = { success: false, loading: false },
  action
) => {
  switch (action.type) {
    case NOTIFICATIONS_DELETE_REQUEST:
      return {
        loading: true,
        success: false,
      };

    case NOTIFICATIONS_DELETE_SUCCESS:
      return {
        loading: false,
        success: true,
      };

    case NOTIFICATIONS_DELETE_FAIL:
      return {
        loading: false,
        error: action.payload,
        success: false,
      };

    case NOTIFICATIONS_DELETE_RESET:
      return {
        loading: false,
        success: false,
      };

    default:
      return state;
  }
};
