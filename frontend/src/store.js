import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { userDetailsReducer, userLoginReducer } from './reducers/userReducers';
import {
  projectDetailsReducer,
  projectListReducer,
} from './reducers/projectReducers';
import { reviewDetailsReducer } from './reducers/reviewReducers';
import {
  mediaCreateReducer,
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
} from './reducers/collaboratorReducers';

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userDetails: userDetailsReducer,
  projectList: projectListReducer,
  projectDetails: projectDetailsReducer,
  reviewDetails: reviewDetailsReducer,
  collaboratorUI: collaboratorUIReducer,
  collaboratorList: collaboratorListReducer,
  collaboratorDetails: collaboratorDetailsReducer,
  collaboratorUsers: collaboratorUsersReducer,
  collaboratorInvitation: collaboratorInvitationReducer,
  playlistDetails: playlistDetailsReducer,
  mediaDetails: mediaDetailsReducer,
  mediaCreate: mediaCreateReducer,
  mediaUpdate: mediaUpdateReducer,
  feedbackList: feedbackListReducer,
  feedbackCreate: feedbackCreateReducer,
  feedbackUpdate: feedbackUpdateReducer,
  feedbackDelete: feedbackDeleteReducer,
  playerDetails: playerDeatilsReducer,
  annotationDeatils: annotationDeatilsReducer,
  assetCreate: assetCreateReducer,
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
