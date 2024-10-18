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
import { setVer, setInstallers } from "@/store/installers/state/state";
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
      return {};
    },
    callbackAfterGet: async (dispatch, getState, payload) => {
      const {
        installers: { data: localInstallers },
        ver: { data: ver },
      } = (getState() as RootState)?.stateInstallers;

      let modifiedLocalInstallers = [...localInstallers];

      //  If we have up-to-date local ver
      if (ver >= payload.ver) return;

      const remoteInstallers = payload?.entities?.length
        ? payload?.entities
        : [];

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

        //  If remote and local have same fields, do nothing
        if (
          localInstallers[localInstallerIndexWithSameId].firstname ==
            remoteInstaller.firstname &&
          localInstallers[localInstallerIndexWithSameId].middlename ==
            remoteInstaller.middlename &&
          localInstallers[localInstallerIndexWithSameId].lastname ==
            remoteInstaller.lastname &&
          localInstallers[localInstallerIndexWithSameId].password ==
            remoteInstaller.password &&
          localInstallers[localInstallerIndexWithSameId].phone ==
            remoteInstaller.phone &&
          localInstallers[localInstallerIndexWithSameId].status ==
            remoteInstaller.status
        )
          return;

        //  If it was modified locally, do nothing, it will be updated in next sync step
        if (localInstallers[localInstallerIndexWithSameId]?.isModified) return;

        //  If it was modified remotely, replace local installer with remote copy
        modifiedLocalInstallers.splice(localInstallerIndexWithSameId, 1, {
          ...remoteInstaller,
          draftId: localInstallers[localInstallerIndexWithSameId].draftId,
        });
      });

      modifiedLocalInstallers = modifiedLocalInstallers.map(
        (localInstaller) => {
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

          //  If found remote with same hash, set remote installer data to local installer
          //  Saving draftId in the installer to retain the ability to navigate by draftId
          return {
            ...remoteInstallers[remoteInstallerIndexWithSameHash],
            draftId: localInstaller.draftId,
          };
        }
      );

      dispatch(setVer({ action: "setData", data: payload.ver }));

      if (!modifiedLocalInstallers?.length) return;

      dispatch(
        setInstallers({ action: "setData", data: modifiedLocalInstallers })
      );
    },
    getAsyncThunk: getCollectionAsyncThunk,
  });

export { reducerName } from "@/store/installers/getCollection/config";
export default installersGetCollectionSlice.reducer;
