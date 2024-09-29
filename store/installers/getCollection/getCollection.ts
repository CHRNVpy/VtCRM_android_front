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
import { DefaultInstallerStateType } from "@/store/installers/state/types";

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
        installers: { data: localInstallers },
        ver: { data: ver },
      } = (getState() as RootState)?.stateInstallers;

      //  If we have up-to-date local ver
      if (ver >= payload.ver) return;

      const modifiedLocalInstallers = [...localInstallers];

      const remoteInstallers = payload?.entities?.length
        ? payload?.entities
        : [];

      if (!remoteInstallers.length) return;

      remoteInstallers.forEach((remoteInstaller: DefaultInstallerStateType) => {
        const localInstallerIndexWithSameId = localInstallers.findIndex(
          (localInstaller) => {
            return remoteInstaller?.id === localInstaller?.id;
          }
        );

        //  If local version is not found, add to local storage
        if (localInstallerIndexWithSameId === -1) {
          modifiedLocalInstallers.push({ ...remoteInstaller });

          return;
        }

        //  If remote and local have same hashes, do nothing
        if (
          localInstallers[localInstallerIndexWithSameId].hash ==
          remoteInstaller.hash
        )
          return;

        //  If it was modified locally, do nothing, it will be updated in next sync step
        if (localInstallers[localInstallerIndexWithSameId]?.isModified) return;

        //  If it was modified remotely, replace local installer with remote copy
        modifiedLocalInstallers.splice(localInstallerIndexWithSameId, 1, {
          ...remoteInstaller,
        });
      });

      modifiedLocalInstallers.map((localInstaller) => {
        //  If local have id, do nothing
        if (localInstaller?.id) return localInstaller;
        //  If local don't have draftId, do nothing
        if (!localInstaller?.draftId) return localInstaller;

        const remoteInstallerIndexWithSameHash = remoteInstallers.findIndex(
          (remoteInstaller: DefaultInstallerStateType) => {
            return remoteInstaller?.hash === localInstaller?.hash;
          }
        );

        //  If nothing with same hash found, do nothing
        if (remoteInstallerIndexWithSameHash === -1) return localInstaller;

        //  If found remote with same id, set data to local
        return remoteInstallers[remoteInstallerIndexWithSameHash];
      });

      dispatch(setVer({ action: "setData", data: payload.ver }));
    },
    getAsyncThunk: getCollectionAsyncThunk,
  });

export { reducerName } from "@/store/installers/getCollection/config";
export default installersGetCollectionSlice.reducer;
