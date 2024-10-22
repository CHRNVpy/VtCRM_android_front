import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import {
  createPatchAsyncThunkWithArguments,
  patchDefaultReducer,
  patchDefaultExtraReducer,
} from "@/store/helpers/patch";
import { reducerName, patchPoolAsyncThunk } from "@/store/pools/patch/config";
import { DefaultPoolStateType } from "@/store/pools/state/types";
import { setPools } from "@/store/pools/state/state";
import {
  DefaultApplicationStateType,
  ApplicationImageType,
} from "@/store/applications/state/types";
import { setApplications } from "@/store/applications/state/state";
import { PatchState } from "@/store/helpers/patch/types";

const isImagesEqual = (
  localImages?: ApplicationImageType[],
  remoteImages?: ApplicationImageType[]
): boolean => {
  if (!localImages && !remoteImages) return true;

  if (!localImages) return false;

  if (!remoteImages) return false;

  // Compare length
  if (localImages.length !== remoteImages.length) return false;

  // Compare by ids
  return localImages.every((localImage) =>
    remoteImages.some((remoteImage) => remoteImage.id === localImage.id)
  );
};

const slice = createSlice({
  name: reducerName,
  initialState: {
    patchPoolState: {} as { [key: string]: PatchState },
  },
  reducers: {
    setPatchPoolStateReducer(state, action) {
      patchDefaultReducer(state, action, ["patchPoolState"]);
    },
  },
  extraReducers: (builder) => {
    patchDefaultExtraReducer(builder, patchPoolAsyncThunk);
  },
});

export const { setPatchPoolStateReducer } = slice.actions;

export const patchPool = createPatchAsyncThunkWithArguments({
  reducer: reducerName,
  path: ["patchPoolState"],
  reducerAction: setPatchPoolStateReducer,
  urlFromStateFunction: (
    getState: Function,
    payload: { [key: string]: any }
  ) => {
    const id = payload?.id;

    return `/admin-pool/${id}`;
  },
  patchAsyncThunk: patchPoolAsyncThunk,
  getDataFromStateFunction: (
    getState: Function,
    payload: { [key: string]: any }
  ) => {
    const {
      pools: { data: pools },
    } = (getState() as RootState)?.statePools;

    const {
      ver: { data: ver },
    } = (getState() as RootState)?.stateApplications;

    const id = payload?.id;

    const pool = pools.reduce(
      (result?: DefaultPoolStateType, item?: DefaultPoolStateType) => {
        if (result) return result;

        if (item?.id == id) return item;

        return result;
      },
      undefined
    );

    const data: { [key: string]: any } = {};

    data.status = pool?.status;
    data.ver = ver;

    return data;
  },
  callbackAfterPatch: async (
    dispatch,
    getState,
    responseData,
    responseStatus,
    payload
  ) => {
    if (responseStatus !== 200) return;
    if (responseData.status !== "ok") return;

    const id = payload?.id;

    const {
      pools: { data: pools },
    } = (getState() as RootState)?.statePools;

    const {
      applications: { data: localApplications },
    } = (getState() as RootState)?.stateApplications;

    const entity = responseData.data.entity;
    const ver = responseData.data.appVer;

    const modifiedPoolsList = [...pools].map((pool) => {
      //  Saving draftId in the pool to retain the ability to navigate by draftId
      if (pool?.id == id) {
        return {
          ...entity,
          applicationsCount: entity?.entities?.length,
          draftId: pool?.draftId,
          page: pool?.page,
          ver: pool?.ver,
        };
      }

      return pool;
    });

    dispatch(setPools({ action: "setData", data: modifiedPoolsList }));

    const remoteApplicationsList = entity.entities;

    let isApplicationsChanged = false;
    let modifiedLocalApplications = [...localApplications];

    //  Parse every remote application
    remoteApplicationsList.forEach(
      (remoteApplication: DefaultApplicationStateType) => {
        const localApplicationIndexWithSameId = localApplications.findIndex(
          (localApplication) => {
            return remoteApplication?.id === localApplication?.id;
          }
        );

        //  If local version is not found, add to local storage
        if (localApplicationIndexWithSameId === -1) {
          modifiedLocalApplications.push({ ...remoteApplication, ver });

          isApplicationsChanged = true;

          return;
        }

        //  If remote and local have same fields, do nothing
        if (
          localApplications[localApplicationIndexWithSameId].type ==
            remoteApplication.type &&
          localApplications[localApplicationIndexWithSameId].installer?.id ==
            remoteApplication.installer?.id &&
          localApplications[localApplicationIndexWithSameId].comment ==
            remoteApplication.comment &&
          localApplications[localApplicationIndexWithSameId].status ==
            remoteApplication.status &&
          localApplications[localApplicationIndexWithSameId].installDate ==
            remoteApplication.installDate &&
          localApplications[localApplicationIndexWithSameId].poolId ==
            remoteApplication.poolId &&
          //  Compare clients
          ((!localApplications[localApplicationIndexWithSameId].client &&
            !remoteApplication.client) ||
            (localApplications[localApplicationIndexWithSameId].client &&
              remoteApplication.client &&
              localApplications[localApplicationIndexWithSameId].client
                .fullName === remoteApplication.client.fullName &&
              localApplications[localApplicationIndexWithSameId].client
                .phone === remoteApplication.client.phone &&
              localApplications[localApplicationIndexWithSameId].client
                .address === remoteApplication.client.address &&
              localApplications[localApplicationIndexWithSameId].client
                .email === remoteApplication.client.email)) &&
          // Compare images
          isImagesEqual(
            localApplications[localApplicationIndexWithSameId]?.images,
            remoteApplication.images
          ) &&
          localApplications[localApplicationIndexWithSameId].page ==
            remoteApplication.page &&
          localApplications[localApplicationIndexWithSameId].ver ==
            remoteApplication.ver
        )
          return;

        //  If it was modified locally, do nothing, it will be updated in next sync step
        if (localApplications[localApplicationIndexWithSameId]?.isModified)
          return;

        //  If it was modified remotely, replace local application with remote copy
        modifiedLocalApplications.splice(localApplicationIndexWithSameId, 1, {
          ...remoteApplication,
          draftId: localApplications[localApplicationIndexWithSameId].draftId,
          poolDraftId:
            localApplications[localApplicationIndexWithSameId].poolDraftId,
          ver,
        });

        isApplicationsChanged = true;
      }
    );

    const poolDraftIdtoPoolId: { [key: number]: number } = {};

    modifiedLocalApplications = modifiedLocalApplications.map(
      (localApplication) => {
        //  If local have id, do nothing
        if (localApplication?.id) return localApplication;
        //  If local don't have draftId, do nothing
        if (!localApplication?.draftId) return localApplication;

        const remoteApplicationIndexWithSameHash =
          remoteApplicationsList.findIndex(
            (remoteApplication: DefaultApplicationStateType) => {
              return remoteApplication?.hash === localApplication?.hash;
            }
          );

        //  If nothing with same hash found, do nothing
        if (remoteApplicationIndexWithSameHash === -1) return localApplication;

        isApplicationsChanged = true;

        if (
          !localApplication?.poolId &&
          localApplication?.poolDraftId &&
          remoteApplicationsList[remoteApplicationIndexWithSameHash].poolId
        )
          poolDraftIdtoPoolId[localApplication.poolDraftId] =
            remoteApplicationsList[remoteApplicationIndexWithSameHash].poolId;

        //  If found remote with same hash, set remote application data to local application
        //  Saving draftId in the application to retain the ability to navigate by draftId
        return {
          ...remoteApplicationsList[remoteApplicationIndexWithSameHash],
          draftId: localApplication.draftId,
          poolDraftId: localApplication.poolDraftId,
          ver,
        };
      }
    );

    //  Set poolId for local applications without poolId, if we get some
    if (Object.keys(poolDraftIdtoPoolId).length)
      modifiedLocalApplications = modifiedLocalApplications.map(
        (localApplication) => {
          //  Don't have poolId, but have poolDraftId, and we can compare them
          if (
            !localApplication?.poolId &&
            localApplication?.poolDraftId &&
            poolDraftIdtoPoolId[localApplication.poolDraftId] &&
            poolDraftIdtoPoolId[localApplication.poolDraftId]
          )
            return {
              ...localApplication,
              poolId: poolDraftIdtoPoolId[localApplication.poolDraftId],
            };

          return localApplication;
        }
      );

    //  Set current applications list
    if (isApplicationsChanged)
      dispatch(
        setApplications({ action: "setData", data: modifiedLocalApplications })
      );
  },
});

export default slice.reducer;
