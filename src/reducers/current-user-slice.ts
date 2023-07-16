import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Auth } from "../services/http";
import { ICurrentUser } from "../models/auth";
import { RootState } from "../store/store";

export interface IUserState {
  user: ICurrentUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isError: boolean;
}

export const USER_FETCH = "USER_FETCH";

const initialState: IUserState = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  isError: false,
};

export const fetchUser = createAsyncThunk(
  USER_FETCH,
  async () => await Auth.me()
);

export const currentUserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reset: () => initialState,
    setError: (state, action) => {
      state.isError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload.data;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
      });
  },
});

export const selectUser = (state: RootState) => state.user;

export const { reset, setError } = currentUserSlice.actions;

export default currentUserSlice.reducer;
