import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import {
  userDetailsReducer,
  userInviteAcceptReducer,
  userInviteGetEmailReducer,
  userListReducer,
  userLoginReducer,
  userPasswordResetConfirmReducer,
  userPasswordResetEmailReducer,
  userUpdateReducer,
  userUploadImageReducer,
} from './reducers/userReducers';
import {
  projectCreateReducer,
  projectDeleteReducer,
  projectDetailsReducer,
  projectListReducer,
  projectUpdateReducer,
  projectUploadImageReducer,
} from './reducers/projectReducers';
import {
  reviewCreateReducer,
  reviewDeleteReducer,
  reviewDetailsReducer,
  reviewListReducer,
  reviewUpdateReducer,
} from './reducers/reviewReducers';
import {
  mediaCreateReducer,
  mediaDeleteReducer,
  mediaDetailsReducer,
  mediaListReducer,
  mediaUpdateReducer,
} from './reducers/mediaReducers';
import {
  feedbackCreateReducer,
  feedbackDeleteReducer,
  feedbackListReducer,
  feedbackUpdateReducer,
} from './reducers/feedbackReducers';
import { playerDeatilsReducer } from './reducers/playerReducers';
import { annotationDeatilsReducer } from './reducers/annotationReducers';
import { assetCreateReducer } from './reducers/assetReducers';
import { playlistDetailsReducer } from './reducers/playlistReducers';
import {
  collaboratorUIReducer,
  collaboratorListReducer,
  collaboratorDetailsReducer,
  collaboratorUsersReducer,
  collaboratorInvitationReducer,
  collaboratorAddReducer,
  collaboratorRemoveReducer,
} from './reducers/collaboratorReducers';
import { toastDetailsReducer } from './reducers/toastReducers';
import {
  searchFilterProjectReducer,
  searchFilterReviewReducer,
  searchProjectReducer,
  searchReviewReducer,
} from './reducers/searchReducers';

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userList: userListReducer,
  userDetails: userDetailsReducer,
  userUpdate: userUpdateReducer,
  userUploadImage: userUploadImageReducer,
  userPasswordResetEmail: userPasswordResetEmailReducer,
  userPasswordResetConfirm: userPasswordResetConfirmReducer,
  userInviteGetEmail: userInviteGetEmailReducer,
  userInviteAccept: userInviteAcceptReducer,
  projectList: projectListReducer,
  projectDetails: projectDetailsReducer,
  projectUploadImage: projectUploadImageReducer,
  projectCreate: projectCreateReducer,
  projectUpdate: projectUpdateReducer,
  projectDelete: projectDeleteReducer,
  reviewList: reviewListReducer,
  reviewDetails: reviewDetailsReducer,
  reviewCreate: reviewCreateReducer,
  reviewUpdate: reviewUpdateReducer,
  reviewDelete: reviewDeleteReducer,
  collaboratorUI: collaboratorUIReducer,
  collaboratorList: collaboratorListReducer,
  collaboratorDetails: collaboratorDetailsReducer,
  collaboratorUsers: collaboratorUsersReducer,
  collaboratorInvitation: collaboratorInvitationReducer,
  collaboratorAdd: collaboratorAddReducer,
  collaboratorRemove: collaboratorRemoveReducer,
  playlistDetails: playlistDetailsReducer,
  mediaList: mediaListReducer,
  mediaDetails: mediaDetailsReducer,
  mediaCreate: mediaCreateReducer,
  mediaUpdate: mediaUpdateReducer,
  mediaDelete: mediaDeleteReducer,
  feedbackList: feedbackListReducer,
  feedbackCreate: feedbackCreateReducer,
  feedbackUpdate: feedbackUpdateReducer,
  feedbackDelete: feedbackDeleteReducer,
  playerDetails: playerDeatilsReducer,
  annotationDeatils: annotationDeatilsReducer,
  assetCreate: assetCreateReducer,
  toastDetails: toastDetailsReducer,
  searchProject: searchProjectReducer,
  searchFilterProject: searchFilterProjectReducer,
  searchReview: searchReviewReducer,
  searchFilterReview: searchFilterReviewReducer,
});

// Config for local storage
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userLogin', 'userDetails', 'projectList'],
};

const persistedReducer = persistReducer(persistConfig, reducer);

const initialState = {};

const middleware = [thunk];

const store = createStore(
  persistedReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export const persistor = persistStore(store);

export default store;
