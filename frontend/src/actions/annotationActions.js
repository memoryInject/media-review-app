import axios from 'axios';
import {
  ANNOTATION_DRAWABLE_TYPE,
  ANNOTATION_IMAGE_FAIL,
  ANNOTATION_IMAGE_LOADING,
  ANNOTATION_IMAGE_SUCCESS,
  ANNOTATION_IS_EMPTY,
  ANNOTATION_SET_ACTIVE,
  ANNOTATION_SET_COLOR,
} from '../constants/annotationConstants';
import getError from '../utils/getError';

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

export const exportImageAnnotation = (file) => async (dispatch, getState) => {
  try {
    dispatch({ type: ANNOTATION_IMAGE_LOADING });

    const {
      userLogin: { userInfo },
    } = getState();

    let formData = new FormData();
    formData.append('image', file, 'image.png');

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Token ${userInfo.key}`,
      },
    };

    const { data } = await axios.post('/api/v1/cloud/upload/annotaion/', formData, config);

    dispatch({ type: ANNOTATION_IMAGE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: ANNOTATION_IMAGE_FAIL, payload: getError(error) });
  }
};
