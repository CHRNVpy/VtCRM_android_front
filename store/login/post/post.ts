import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import {
  defaultInputState,
  setInputStateDefaultReducer,
} from "@/store/helpers/input";
import {
  postDefaultReducer,
  defaultPostState,
  createPostAsyncThunkWithArguments,
  postDefaultExtraReducer,
} from "@/store/helpers/post";
import { reducerName, postLoginAsyncThunk } from "@/store/login/post/config";

const slice = createSlice({
  name: reducerName,
  initialState: {
    postLoginState: { ...defaultPostState },
    postLoginFields: {
      inputs: {
        login: {
          ...defaultInputState,
        },
        password: {
          ...defaultInputState,
        },
      },
    },
  },
  reducers: {
    setPostLoginStateReducer(state, action) {
      postDefaultReducer(state, action, ["postLoginState"]);
    },
    setInputStateLoginReducer(state, action) {
      setInputStateDefaultReducer(state, action, [
        "postLoginFields",
        "inputs",
        "login",
      ]);
    },
    setInputStatePasswordReducer(state, action) {
      setInputStateDefaultReducer(state, action, [
        "postLoginFields",
        "inputs",
        "password",
      ]);
    },
  },
  extraReducers: (builder) => {
    postDefaultExtraReducer(builder, postLoginAsyncThunk, {
      fulfilled: (stateByPath, status) => {
        console.log(status);

        if (status == 401 || status == 403) {
          stateByPath.responseData = null;
          stateByPath.isError = true;
          stateByPath.errorFields = ["login", "password"];
          stateByPath.errorText = "Неправильный номер договора или пароль";
        }
      },
    });
  },
});

export const {
  setInputStateLoginReducer,
  setInputStatePasswordReducer,
  setPostLoginStateReducer,
} = slice.actions;

export const postLogin = createPostAsyncThunkWithArguments({
  reducer: reducerName,
  isAuthorization: true,
  path: ["postLoginState"],
  reducerAction: setPostLoginStateReducer,
  url: "/auth/access_token",
  postAsyncThunk: postLoginAsyncThunk,
  getDataFromStateFunction: (getState: Function) => {
    const {
      postLoginFields: {
        inputs: {
          login: { text: loginText },
          password: { text: passwordText },
        },
      },
    } = (getState() as RootState)?.postLogin;

    const data: { [key: string]: any } = {};

    data.login = loginText;
    data.password = passwordText;
    data.role = "installer";

    return data;
  },
  callbackAfterPost: async (dispatch, getState, responseData) => {
    console.log(responseData);
    /*
    if (responseData?.access_token)
      jsCookie.set("access-token", responseData?.access_token, {
        path: "/",
        expires: new Date(new Date().getTime() + 10 * 60 * 1000),
      });

    if (responseData?.refresh_token)
      jsCookie.set("refresh-token", responseData?.refresh_token, {
        path: "/",
        expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      });
      */
  },
});

export default slice.reducer;
