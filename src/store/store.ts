import { configureStore } from "@reduxjs/toolkit";
import currentUserReducer from "../reducers/current-user-slice";
import userListReducer from "../reducers/user-list-slice";

export const store = configureStore({
  reducer: {
    currentUser: currentUserReducer,
    userList: userListReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
