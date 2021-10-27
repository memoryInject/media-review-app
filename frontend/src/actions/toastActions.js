import {
  TOAST_SHOW,
  TOAST_HIDE,
  TOAST_MESSAGE,
  TOAST_RESET,
  TOAST_VARIANT,
} from '../constants/toastConstants';

export const showToast = () => {
  return { type: TOAST_SHOW };
};

export const hideToast = () => {
  return { type: TOAST_HIDE };
};

export const messageToast = (message) => {
  return { type: TOAST_MESSAGE, payload: message };
};

export const variantToast = (variant) => {
  return { type: TOAST_VARIANT, payload: variant };
};

export const resetToast = () => {
  return { type: TOAST_RESET };
};
