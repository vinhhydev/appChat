import {configureStore} from '@reduxjs/toolkit';
import {rootReducer} from './rootReducer';
import logger from 'redux-logger';
import reactotron from '../../ReactotronConfig';
// const middlewares: any = [];

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
  enhancers: getDefaultEnhancers =>
    __DEV__
      ? getDefaultEnhancers().concat(reactotron.createEnhancer!())
      : getDefaultEnhancers(),
  // middleware: getDefaultMiddleware =>
  //   getDefaultMiddleware().concat(middlewares),
  // <-- add middleware debugger flipper
  // Middleware mặc định là redux-thunk nên không cần cấu hình nếu không dùng thêm các middleware khác
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
