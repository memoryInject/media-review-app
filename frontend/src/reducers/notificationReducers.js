import {
  NOTIFICATIONS_DELETE_FAIL,
  NOTIFICATIONS_DELETE_REQUEST,
  NOTIFICATIONS_DELETE_RESET,
  NOTIFICATIONS_DELETE_SUCCESS,
  NOTIFICATION_ADD,
  NOTIFICATION_DELETE,
  NOTIFICATION_LIST_CLEAR,
  NOTIFICATION_LIST_FAIL,
  NOTIFICATION_LIST_REQUEST,
  NOTIFICATION_LIST_RESET,
  NOTIFICATION_LIST_SUCCESS,
  NOTIFICATION_NEW_COUNT_RESET,
  NOTIFICATIONS_CHECKED
} from '../constants/notificationConstants';

const notificationListAdd = (results, notifications) => {
  // Get difference
  const filteredResults = results.filter(
    (p) => !notifications.some((n) => p.id === n.id)
  );

  return filteredResults;
};

const notificaionAdd = (payload, notifications) => {
  let filtered = notifications.filter((n) => n.id === payload.id);
  let newPayload = filtered.length ? [] : [payload];

  return newPayload;
};

export const notificationListReducer = (
  state = {
    notifications: [],
    loading: false,
    error: null,
    success: false,
    newCount: 0,
  },
  action
) => {
  switch (action.type) {
    case NOTIFICATION_LIST_REQUEST:
      return {
        loading: true,
        error: null,
        success: false,
        newCount: state.newCount,
        notifications: state.notifications,
      };

    case NOTIFICATION_LIST_SUCCESS:
      const filteredResults = notificationListAdd(
        action.payload.results,
        state.notifications
      );
      return {
        loading: false,
        error: null,
        success: true,
        newCount: state.newCount + filteredResults.length,
        notifications: [...filteredResults, ...state.notifications ].slice(
          0,
          20
        ),
      };

    case NOTIFICATION_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
        success: false,
        newCount: state.newCount,
        notifications: state.notifications,
      };

    case NOTIFICATION_LIST_RESET:
      return {
        loading: false,
        error: null,
        success: false,
        newCount: state.newCount,
        notifications: state.notifications,
      };

    case NOTIFICATION_LIST_CLEAR:
      return {
        loading: false,
        error: null,
        success: false,
        newCount: 0,
        notifications: [],
      };

    case NOTIFICATION_ADD:
      const newPayload = notificaionAdd(action.payload, state.notifications);
      return {
        loading: false,
        error: null,
        success: state.success,
        newCount: state.newCount + newPayload.length,
        notifications: [...newPayload, ...state.notifications].slice(0, 20),
      };

    case NOTIFICATION_DELETE:
      return {
        loading: false,
        error: null,
        success: state.success,
        newCount: state.newCount,
        notifications: state.notifications.filter(n => n.id !== action.payload.id),
      };

    case NOTIFICATIONS_CHECKED:
      return {
        loading: false,
        error: null,
        success: state.success,
        newCount: state.newCount,
        notifications: state.notifications.map(n => {
          n.checked = true;
          return n;
        })
      }

    case NOTIFICATION_NEW_COUNT_RESET:
      return {
        ...state,
        newCount: 0,
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
