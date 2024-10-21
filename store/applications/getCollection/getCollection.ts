import { createSlice } from "@reduxjs/toolkit";
import {
  createGetCollectionAsyncThunkWithArguments,
  setGetCollectionStateDefaultReducer,
  getCollectionDefaultExtraReducer,
} from "@/store/helpers/getCollection";
import {
  reducerName,
  getCollectionAsyncThunk,
} from "@/store/applications/getCollection/config";
import {
  setAccessToken,
  setRefreshToken,
} from "@/store/navigation/state/state";
import {
  setVer,
  setPagesLoaded,
  setTotalPages,
  setCurrentPage,
  setApplications,
} from "@/store/applications/state/state";
import { RootState } from "@/store/store";
import {
  DefaultApplicationStateType,
  ApplicationImageType,
} from "@/store/applications/state/types";
import { GetCollectionState } from "@/store/helpers/getCollection/types";

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

const applicationsGetCollectionSlice = createSlice({
  name: reducerName,
  initialState: {
    applicationsGetCollectionState: {} as {
      [key: string]: GetCollectionState;
    },
  },
  reducers: {
    setApplicationsGetCollectionStateReducer(state, action) {
      setGetCollectionStateDefaultReducer(state, action, [
        "applicationsGetCollectionState",
      ]);
    },
  },
  extraReducers: (builder) => {
    getCollectionDefaultExtraReducer(builder, getCollectionAsyncThunk);
  },
});

export const { setApplicationsGetCollectionStateReducer } =
  applicationsGetCollectionSlice.actions;

export const getApplicationsCollection =
  createGetCollectionAsyncThunkWithArguments({
    reducer: reducerName,
    path: ["applicationsGetCollectionState"],
    reducerAction: setApplicationsGetCollectionStateReducer,
    setAccessToken,
    setRefreshToken,
    url: "/admin-application-collection",
    getParamsFromStateFunction: (
      getState: Function,
      payload: { [key: string]: any }
    ) => {
      const page = payload?.page ? payload.page : 1;
      const poolId = payload?.payload?.poolId;

      const params: { [key: string]: any } = {};

      if (page) params.page = page;

      if (poolId) {
        params.pool_id = poolId;
        params.per_page = 100;
      }

      return params;
    },
    callbackAfterGet: async (dispatch, getState, payload) => {
      const {
        pagesLoaded: { data: pagesLoaded },
        applications: { data: localApplications },
      } = (getState() as RootState)?.stateApplications;

      const pages = payload.pages;
      const page = payload.page;
      const ver = payload.appVer;

      let isChanged = false;

      console.log(payload?.entities, page, pages);

      let modifiedLocalApplications = [...localApplications];
      const remoteApplicationsList = payload?.entities?.length
        ? payload?.entities
        : [];

      remoteApplicationsList.forEach(
        (remoteApplication: DefaultApplicationStateType) => {
          const localApplicationIndexWithSameId = localApplications.findIndex(
            (localApplication) => {
              return remoteApplication?.id === localApplication?.id;
            }
          );

          //  If local version is not found, add to local storage
          if (localApplicationIndexWithSameId === -1) {
            modifiedLocalApplications.push({ ...remoteApplication, page, ver });

            isChanged = true;

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
            page,
            ver,
            draftId: localApplications[localApplicationIndexWithSameId].draftId,
          });

          isChanged = true;
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
          if (remoteApplicationIndexWithSameHash === -1)
            return localApplication;

          isChanged = true;

          if (localApplication?.poolDraftId)
            poolDraftIdtoPoolId[localApplication.poolDraftId] =
              remoteApplicationsList[remoteApplicationIndexWithSameHash].poolId;

          //  If found remote with same hash, set remote application data to local application
          //  Saving draftId in the application to retain the ability to navigate by draftId
          return {
            ...remoteApplicationsList[remoteApplicationIndexWithSameHash],
            draftId: localApplication.draftId,
            page,
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
              localApplication.poolDraftId in poolDraftIdtoPoolId
            )
              return {
                ...localApplication,
                poolId: poolDraftIdtoPoolId[localApplication.poolDraftId],
              };

            return localApplication;
          }
        );

      // Set ver for POST and PATCH
      dispatch(
        setVer({
          action: "setData",
          data: ver,
        })
      );

      if (!isChanged) return;

      //  Save max page that was loaded
      dispatch(
        setPagesLoaded({
          action: "setData",
          data: pagesLoaded >= page ? pagesLoaded : page,
        })
      );

      //  Set total page in db
      dispatch(setTotalPages({ action: "setData", data: pages }));

      //  Set current applications list
      dispatch(
        setApplications({ action: "setData", data: modifiedLocalApplications })
      );

      //  Set current page to update by sync
      dispatch(setCurrentPage({ action: "setData", data: page }));
    },
    getAsyncThunk: getCollectionAsyncThunk,
  });

export { reducerName } from "@/store/applications/getCollection/config";
export default applicationsGetCollectionSlice.reducer;
