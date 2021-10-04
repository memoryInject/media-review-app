import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { userDetailsReducer, userLoginReducer } from './reducers/userReducers';

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userDetails: userDetailsReducer
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
