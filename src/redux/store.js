// store.js
import { applyMiddleware, combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from "@redux-devtools/extension";
import reducer from './reducer';

const rootReducer = combineReducers({
  data: reducer,
});

const store = configureStore(
  {reducer: rootReducer},
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
