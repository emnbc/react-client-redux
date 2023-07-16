import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Users } from "../services/http";
import { RootState } from "../store/store";
import { UserItem } from "../models/users";
import { AxiosResponse } from "axios";

export interface IUserListState {
  users: UserItem[];
  isLoading: boolean;
  isError: boolean;
}

export const USER_LIST_FETCH = "USER_LIST_FETCH";

const initialState: IUserListState = {
  users: [],
  isLoading: false,
  isError: false,
};

export const fetchUserList = createAsyncThunk<
  AxiosResponse<UserItem[]>,
  void,
  { state: RootState }
>(USER_LIST_FETCH, async (arg, { getState }) => {
  const { userList } = getState(); // TODO:
  return await Users.getList();
});

export const currentUserSlice = createSlice({
  name: "user-list",
  initialState,
  reducers: {
    reset: () => initialState,
    setError: (state, action) => {
      state.isError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserList.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.data;
      })
      .addCase(fetchUserList.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
      });
  },
});

export const { reset, setError } = currentUserSlice.actions;

export default currentUserSlice.reducer;
