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
} from "@/store/equipments/getCollection/config";
import {
  setAccessToken,
  setRefreshToken,
} from "@/store/navigation/state/state";
import { setVer, setEquipments } from "@/store/equipments/state/state";
import { RootState } from "@/store/store";
import { DefaultEquipmentStateType } from "@/store/equipments/state/types";

const equipmentsGetCollectionSlice = createSlice({
  name: reducerName,
  initialState: {
    equipmentsGetCollectionState: { ...defaultGetCollectionState },
  },
  reducers: {
    setEquipmentsGetCollectionStateReducer(state, action) {
      setGetCollectionStateDefaultReducer(state, action, [
        "equipmentsGetCollectionState",
      ]);
    },
  },
  extraReducers: (builder) => {
    getCollectionDefaultExtraReducer(builder, getCollectionAsyncThunk);
  },
});

export const { setEquipmentsGetCollectionStateReducer } =
  equipmentsGetCollectionSlice.actions;

export const getEquipmentsCollection =
  createGetCollectionAsyncThunkWithArguments({
    reducer: reducerName,
    path: ["equipmentsGetCollectionState"],
    reducerAction: setEquipmentsGetCollectionStateReducer,
    setAccessToken,
    setRefreshToken,
    url: "/equipment-collection",
    getParamsFromStateFunction: (getState: Function) => {
      const {
        equipmentsGetCollectionState: { variables, filters, page, perPage },
      } = (getState() as RootState)?.getCollectionEquipments;

      const params: { [key: string]: any } = {};

      if (page) params.page = page;
      if (perPage) params.perPage = perPage;

      return params;
    },
    callbackAfterGet: async (dispatch, getState, payload) => {
      const {
        equipments: { data: localEquipments },
        ver: { data: ver },
      } = (getState() as RootState)?.stateEquipments;

      const modifiedLocalEquipments = [...localEquipments];

      //  If we have up-to-date local ver
      if (ver >= payload.ver) return;

      const remoteEquipments = payload?.entities?.length
        ? payload?.entities
        : [];

      if (!remoteEquipments.length) return;

      remoteEquipments.forEach((remoteEquipment: DefaultEquipmentStateType) => {
        const localEquipmentIndexWithSameId = localEquipments.findIndex(
          (localEquipment) => {
            return remoteEquipment?.id === localEquipment?.id;
          }
        );

        //  If local version is not found, add to local storage
        if (localEquipmentIndexWithSameId === -1) {
          modifiedLocalEquipments.push({ ...remoteEquipment });

          return;
        }

        //  If remote and local have same fields, do nothing
        if (
          localEquipments[localEquipmentIndexWithSameId].name ==
            remoteEquipment.name &&
          localEquipments[localEquipmentIndexWithSameId].serialNumber ==
            remoteEquipment.serialNumber &&
          localEquipments[localEquipmentIndexWithSameId].comment ==
            remoteEquipment.comment &&
          localEquipments[localEquipmentIndexWithSameId].status ==
            remoteEquipment.status
        )
          return;

        //  If it was modified locally, do nothing, it will be updated in next sync step
        if (localEquipments[localEquipmentIndexWithSameId]?.isModified) return;

        //  If it was modified remotely, replace local equipment with remote copy
        modifiedLocalEquipments.splice(localEquipmentIndexWithSameId, 1, {
          ...remoteEquipment,
        });
      });

      modifiedLocalEquipments.map((localEquipment) => {
        //  If local have id, do nothing
        if (localEquipment?.id) return localEquipment;
        //  If local don't have draftId, do nothing
        if (!localEquipment?.draftId) return localEquipment;

        const remoteEquipmentIndexWithSameHash = remoteEquipments.findIndex(
          (remoteEquipment: DefaultEquipmentStateType) => {
            return remoteEquipment?.hash === localEquipment?.hash;
          }
        );

        //  If nothing with same hash found, do nothing
        if (remoteEquipmentIndexWithSameHash === -1) return localEquipment;

        //  If found remote with same hash, set remote equipment data to local equipment
        //  Saving draftId in the equipment to retain the ability to navigate by draftId
        return {
          ...remoteEquipments[remoteEquipmentIndexWithSameHash],
          draftId: localEquipment.draftId,
        };
      });

      dispatch(setVer({ action: "setData", data: payload.ver }));
      dispatch(
        setEquipments({ action: "setData", data: modifiedLocalEquipments })
      );
    },
    getAsyncThunk: getCollectionAsyncThunk,
  });

export { reducerName } from "@/store/equipments/getCollection/config";
export default equipmentsGetCollectionSlice.reducer;
