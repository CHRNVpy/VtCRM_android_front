import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { login: "", password: "" },
  reducers: {
    setLogin: (state, action) => {
      state.login = action.payload.value;
    },
    setPassword: (state, action) => {
      state.password = action.payload.value;
    },
  },
});

export const { setLogin, setPassword } = authSlice.actions;

export default authSlice.reducer;
