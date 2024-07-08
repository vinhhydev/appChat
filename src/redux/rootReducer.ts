import {combineReducers} from '@reduxjs/toolkit';
import user from './slices/userSlice';

export const rootReducer = combineReducers({
  user,
});
