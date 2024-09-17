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
import {
  setAccessToken,
  setRefreshToken,
} from "@/store/navigation/state/state";

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
      fulfilled: (stateByPath, status, data) => {
        if (data.status == "error") {
          stateByPath.responseData = data;
          stateByPath.isError = true;

          if (data.code == "Incorrect username or password") {
            stateByPath.errorFields = ["login", "password"];
            stateByPath.errorText = "Неправильный номер договора или пароль";
          }

          if (data.code == "Incorrect username or password") {
            stateByPath.errorFields = ["login", "password"];
            stateByPath.errorText = "Произошла ошибка при авторизации";
          }
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
  url: "/auth",
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

    return data;
  },
  callbackAfterPost: async (dispatch, getState, responseData) => {
    if (responseData.status != "ok") return;
    if (!responseData.data) return;
    if (!responseData.data.accessToken) return;
    if (!responseData.data.refreshToken) return;

    dispatch(
      setAccessToken({ action: "setData", data: responseData.data.accessToken })
    );
    dispatch(
      setRefreshToken({
        action: "setData",
        data: responseData.data.refreshToken,
      })
    );
  },
});

export default slice.reducer;
