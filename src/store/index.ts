import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './sessionSlice';
import navigationReducer from './navigationSlice';

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    navigation: navigationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
