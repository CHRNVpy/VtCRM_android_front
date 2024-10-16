import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import {
  createPatchAsyncThunkWithArguments,
  patchDefaultReducer,
  patchDefaultExtraReducer,
} from "@/store/helpers/patch";
import {
  reducerName,
  patchEquipmentAsyncThunk,
} from "@/store/equipments/patch/config";
import { DefaultEquipmentStateType } from "@/store/equipments/state/types";
import { setEquipments } from "@/store/equipments/state/state";
import { getEquipmentsCollection } from "@/store/equipments/getCollection/getCollection";
import { PatchState } from "@/store/helpers/patch/types";

const slice = createSlice({
  name: reducerName,
  initialState: {
    patchEquipmentState: {} as { [key: string]: PatchState },
  },
  reducers: {
    setPatchEquipmentStateReducer(state, action) {
      patchDefaultReducer(state, action, ["patchEquipmentState"]);
    },
  },
  extraReducers: (builder) => {
    patchDefaultExtraReducer(builder, patchEquipmentAsyncThunk);
  },
});

export const { setPatchEquipmentStateReducer } = slice.actions;

export const patchEquipment = createPatchAsyncThunkWithArguments({
  reducer: reducerName,
  path: ["patchEquipmentState"],
  reducerAction: setPatchEquipmentStateReducer,
  urlFromStateFunction: (
    getState: Function,
    payload: { [key: string]: any }
  ) => {
    const id = payload?.id;

    return `/equipment/${id}`;
  },
  patchAsyncThunk: patchEquipmentAsyncThunk,
  getDataFromStateFunction: (
    getState: Function,
    payload: { [key: string]: any }
  ) => {
    const {
      equipments: { data: equipments },
      ver: { data: ver },
    } = (getState() as RootState)?.stateEquipments;

    const id = payload?.id;

    const equipment = equipments.reduce(
      (
        result?: DefaultEquipmentStateType,
        item?: DefaultEquipmentStateType
      ) => {
        if (result) return result;

        if (item?.id == id) return item;

        return result;
      },
      undefined
    );

    const data: { [key: string]: any } = {};

    data.id = equipment?.id;
    data.name = equipment?.name;
    data.serialNumber = equipment?.serialNumber;
    data.comment = equipment?.comment;
    data.hash = equipment?.hash;
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
      equipments: { data: equipments },
    } = (getState() as RootState)?.stateEquipments;

    const entity = responseData.data.entity;

    let page = 1;

    const modifiedEquipments = [...equipments].map((equipment) => {
      //  Saving draftId in the equipment to retain the ability to navigate by draftId
      if (equipment?.id == id) {
        page = equipment?.page ? equipment.page : page;

        return {
          ...entity,
          draftId: equipment?.draftId,
          page: equipment?.page,
          ver: equipment?.ver,
        };
      }

      return equipment;
    });

    dispatch(setEquipments({ action: "setData", data: modifiedEquipments }));
    dispatch(getEquipmentsCollection({ page: page }));
  },
});

export default slice.reducer;
