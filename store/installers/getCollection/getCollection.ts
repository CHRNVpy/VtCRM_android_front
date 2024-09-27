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

export const getTransactionCollection =
  createGetCollectionAsyncThunkWithArguments({
    reducer: reducerName,
    path: ["installersGetCollectionState"],
    reducerAction: setInstallersGetCollectionStateReducer,
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
    callbackAfterGet: async (dispatch, payload) => {},
    getAsyncThunk: getCollectionAsyncThunk,
  });

export { reducerName } from "@/store/installers/getCollection/config";
export default installersGetCollectionSlice.reducer;
