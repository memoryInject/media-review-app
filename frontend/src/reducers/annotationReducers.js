import {
  ANNOTATION_SET_ACTIVE,
  ANNOTATION_DRAWABLE_TYPE,
  ANNOTATION_IS_EMPTY,
  ANNOTATION_SET_COLOR,
} from '../constants/annotationConstants';

export const annotationDeatilsReducer = (
  state = { active: false, drawableType: 'ArrowDrawable', isEmpty: true, color: '#841397' },
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

    default:
      return state;
  }
};
