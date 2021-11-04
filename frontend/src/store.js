import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { userDetailsReducer, userListReducer, userLoginReducer, userPasswordResetEmailReducer, userUpdateReducer, userUploadImageReducer } from './reducers/userReducers';
import {
  projectCreateReducer,
  projectDeleteReducer,
  projectDetailsReducer,
  projectListReducer,
  projectUpdateReducer,
  projectUploadImageReducer,
} from './reducers/projectReducers';
import { reviewCreateReducer, reviewDeleteReducer, reviewDetailsReducer, reviewUpdateReducer } from './reducers/reviewReducers';
import {
  mediaCreateReducer,
  mediaDeleteReducer,
  mediaDetailsReducer,
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
import {toastDetailsReducer} from './reducers/toastReducers';

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userList: userListReducer,
  userDetails: userDetailsReducer,
  userUpdate: userUpdateReducer,
  userUploadImage: userUploadImageReducer,
  userPasswordResetEmail: userPasswordResetEmailReducer,
  projectList: projectListReducer,
  projectDetails: projectDetailsReducer,
  projectUploadImage: projectUploadImageReducer,
  projectCreate: projectCreateReducer,
  projectUpdate: projectUpdateReducer,
  projectDelete: projectDeleteReducer,
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
});

// Config for local storage
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userLogin', 'userDetails'],
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
