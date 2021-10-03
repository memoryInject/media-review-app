import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { userLoginReducer } from './reducers/userReducers';

const reducer = combineReducers({
  userLogin: userLoginReducer
});

// Config for local storage
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userLogin'],
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
