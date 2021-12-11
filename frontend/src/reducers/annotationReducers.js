import {
  ANNOTATION_SET_ACTIVE,
  ANNOTATION_DRAWABLE_TYPE,
  ANNOTATION_IS_EMPTY,
  ANNOTATION_SET_COLOR,
  ANNOTATION_IMAGE_LOADING,
  ANNOTATION_IMAGE_SUCCESS,
  ANNOTATION_IMAGE_FAIL,
  ANNOTATION_IMAGE_RESET,
  ANNOTATION_IMAGE_EXPORT,
} from '../constants/annotationConstants';

export const annotationDeatilsReducer = (
  state = {
    active: false,
    drawableType: 'ArrowDrawable',
    isEmpty: true,
    color: '#841397',
    image: null,
  },
  action
) => {
  switch (action.type) {
    case ANNOTATION_SET_ACTIVE:
      return { ...state, active: action.payload };

    case ANNOTATION_DRAWABLE_TYPE:
      return { ...state, drawableType: action.payload };

    case ANNOTATION_IS_EMPTY:
      return { ...state, isEmpty: action.payload };

    case ANNOTATION_SET_COLOR:
      return { ...state, color: action.payload };

    case ANNOTATION_IMAGE_EXPORT:
      return { ...state, image: { export: true } };

    case ANNOTATION_IMAGE_LOADING:
      return { ...state, image: { loading: true } };

    case ANNOTATION_IMAGE_SUCCESS:
      return { ...state, image: { loading: false, url: action.payload.secureUrl } };

    case ANNOTATION_IMAGE_FAIL:
      return { ...state, image: { loading: false, error: action.payload } };

    case ANNOTATION_IMAGE_RESET:
      return { ...state, image: null };

    default:
      return state;
  }
};
