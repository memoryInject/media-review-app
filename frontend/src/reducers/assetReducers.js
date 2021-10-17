import {
  ASSET_CREATE_REQUEST,
  ASSET_CREATE_SUCCESS,
  ASSET_CREATE_FAIL,
  ASSET_CREATE_RESET,
} from '../constants/assetConstants';

export const assetCreateReducer = (state = { asset: null }, action) => {
  switch (action.type) {
    case ASSET_CREATE_REQUEST:
      return { loading: true, asset: null };

    case ASSET_CREATE_SUCCESS:
      return { loading: false, asset: action.payload };

    case ASSET_CREATE_FAIL:
      return { loading: false, error: action.payload };

    case ASSET_CREATE_RESET:
      return { loading: false, asset: null };

    default:
      return state;
  }
};
