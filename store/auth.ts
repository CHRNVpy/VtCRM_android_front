import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { login: "", password: "" },
  reducers: {
    setLogin: (state, action) => {
      state.login = action.payload.login;
    },
  },
});

export const { setLogin } = authSlice.actions;

export default authSlice.reducer;
