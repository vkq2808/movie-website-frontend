// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { AuthReducer } from './features';
import { authApi } from './services';

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
