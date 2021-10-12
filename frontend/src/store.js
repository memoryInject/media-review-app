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
import { mediaDetailsReducer } from './reducers/mediaReducers';
import {
  feedbackCreateReducer,
  feedbackListReducer,
} from './reducers/feedbackReducers';
import { playerDeatilsReducer } from './reducers/playerReducers';
import {annotationDeatilsReducer} from './reducers/annotationReducers';

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userDetails: userDetailsReducer,
  projectList: projectListReducer,
  projectDetails: projectDetailsReducer,
  reviewDetails: reviewDetailsReducer,
  mediaDetails: mediaDetailsReducer,
  feedbackList: feedbackListReducer,
  feedbackCreate: feedbackCreateReducer,
  playerDetails: playerDeatilsReducer,
  annotationDeatils: annotationDeatilsReducer,
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
