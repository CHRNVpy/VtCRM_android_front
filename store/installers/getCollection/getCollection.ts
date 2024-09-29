import { createSlice } from "@reduxjs/toolkit";
import {
  defaultGetCollectionState,
  createGetCollectionAsyncThunkWithArguments,
  setGetCollectionStateDefaultReducer,
  getCollectionDefaultExtraReducer,
} from "@/store/helpers/getCollection";
import {
  reducerName,
  getCollectionAsyncThunk,
} from "@/store/installers/getCollection/config";
import {
  setAccessToken,
  setRefreshToken,
} from "@/store/navigation/state/state";
import { setVer } from "@/store/installers/state/state";
import { RootState } from "@/store/store";

const installersGetCollectionSlice = createSlice({
  name: reducerName,
  initialState: {
    installersGetCollectionState: { ...defaultGetCollectionState },
  },
  reducers: {
    setInstallersGetCollectionStateReducer(state, action) {
      setGetCollectionStateDefaultReducer(state, action, [
        "installersGetCollectionState",
      ]);
    },
  },
  extraReducers: (builder) => {
    getCollectionDefaultExtraReducer(builder, getCollectionAsyncThunk);
  },
});

export const { setInstallersGetCollectionStateReducer } =
  installersGetCollectionSlice.actions;

export const getInstallersCollection =
  createGetCollectionAsyncThunkWithArguments({
    reducer: reducerName,
    path: ["installersGetCollectionState"],
    reducerAction: setInstallersGetCollectionStateReducer,
    setAccessToken,
    setRefreshToken,
    url: "/installer-collection",
    getParamsFromStateFunction: (getState: Function) => {
      const {
        installersGetCollectionState: { variables, filters, page, perPage },
      } = (getState() as RootState)?.getCollectionInstallers;

      const params: { [key: string]: any } = {};

      if (page) params.page = page;
      if (perPage) params.perPage = perPage;

      return params;
    },
    callbackAfterGet: async (dispatch, getState, payload) => {
      const {
        ver: { data: ver },
      } = (getState() as RootState)?.stateInstallers;

      console.log("VER UPDATED");

      //  If we have up-to-date local ver
      if (ver == payload.ver) return;

      /*
        если версия которая пришла больше локальной:
        1. проходимся по тем где есть id (те, что пришли с сервера)
        если их нет локально, создаем
        если они есть локально и хеши совпадают ничего не делаем
        если они есть локально и хеши не совпадают, и были локальные изменения, считаем локальные более важными
        если они есть локально и хеши не совпадают, и не было локальных изменений, считаем удаленные более важными
        2. проходимся по тем локальным, у которых нет id, а есть draftId
        если hash совпадает, присваиваем id из удаленного
        если hash не совпадает, сохраняем draftId до отправки обновления
      */

      console.log(payload, ver);

      dispatch(setVer({ action: "setData", data: payload.ver }));
    },
    getAsyncThunk: getCollectionAsyncThunk,
  });

export { reducerName } from "@/store/installers/getCollection/config";
export default installersGetCollectionSlice.reducer;
