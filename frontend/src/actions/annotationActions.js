import {
  ANNOTATION_DRAWABLE_TYPE,
  ANNOTATION_IS_EMPTY,
  ANNOTATION_SET_ACTIVE,
  ANNOTATION_SET_COLOR,
} from '../constants/annotationConstants';

export const setActiveAnnotation = (active) => {
  return {
    type: ANNOTATION_SET_ACTIVE,
    payload: active,
  };
};

export const drawableTypeAnnotation = (type) => {
  return {
    type: ANNOTATION_DRAWABLE_TYPE,
    payload: type,
  };
};

export const isEmptyAnnotation = (empty) => {
  return {
    type: ANNOTATION_IS_EMPTY,
    payload: empty,
  };
};

export const setColorAnnotation = (color) => {
  return {
    type: ANNOTATION_SET_COLOR,
    payload: color,
  };
};
