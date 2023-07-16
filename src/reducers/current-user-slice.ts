import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Auth } from "../services/http";
import { ICurrentUser } from "../models/auth";
import { RootState } from "../store/store";

export interface ICurrentUserState {
  user: ICurrentUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isError: boolean;
}

export const CURRENT_USER_FETCH = "CURRENT_USER_FETCH";

const initialState: ICurrentUserState = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  isError: false,
};

export const fetchCurrentUser = createAsyncThunk(
  CURRENT_USER_FETCH,
  async () => await Auth.me()
);

export const currentUserSlice = createSlice({
  name: "current-user",
  initialState,
  reducers: {
    reset: () => initialState,
    setError: (state, action) => {
      state.isError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload.data;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
      });
  },
});

export const selectUser = (state: RootState) => state.currentUser;

export const { reset, setError } = currentUserSlice.actions;

export default currentUserSlice.reducer;
