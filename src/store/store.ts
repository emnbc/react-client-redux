import { configureStore } from "@reduxjs/toolkit";
import currentUserReducer from "../reducers/current-user-slice";

export const store = configureStore({
  reducer: {
    user: currentUserReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
