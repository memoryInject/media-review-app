import {
  TOAST_SHOW,
  TOAST_HIDE,
  TOAST_MESSAGE,
  TOAST_RESET,
  TOAST_VARIANT,
} from '../constants/toastConstants'


export const toastDetailsReducer = (state = { showUI: false, message: null, variant: 'success' }, action) => {
  switch (action.type) {
    case TOAST_SHOW:
      return { ...state, showUI: true };

    case TOAST_HIDE:
      return { ...state, showUI: false };

    case TOAST_MESSAGE:
      return {...state, message: action.payload}

    case TOAST_VARIANT:
      return {...state, variant: action.payload}

    case TOAST_RESET:
      return { showUI: false, message: null, variant: 'success' }

    default:
      return state;
  }
};
