import { createSlice } from "@reduxjs/toolkit";
import {
  defaultState,
  setStateDefaultReducer,
  SetStateDefaultReducerActionType,
} from "@/store/helpers/state";
import {
  InputStateDefaultReducerActionType,
  defaultInputState,
  setInputStateDefaultReducer,
} from "@/store/helpers/input";
import { reducerName } from "@/store/equipments/state/config";
import { defaultEquipmentsState } from "@/store/equipments/state/defaultState";

const slice = createSlice({
  name: reducerName,
  initialState: {
    ver: { ...defaultState, data: 0 },
    pagesLoaded: { ...defaultState, data: 0 },
    totalPages: { ...defaultState, data: 0 },
    equipments: {
      ...defaultEquipmentsState,
    },
    createEquipmentFields: {
      inputs: {
        name: {
          ...defaultInputState,
        },
        serialNumber: {
          ...defaultInputState,
        },
        comment: {
          ...defaultInputState,
        },
      },
    },
    editEquipmentFields: {
      inputs: {
        name: {
          ...defaultInputState,
        },
        serialNumber: {
          ...defaultInputState,
        },
        comment: {
          ...defaultInputState,
        },
      },
    },
  },
  reducers: {
    setVer(state, action: SetStateDefaultReducerActionType) {
      setStateDefaultReducer(state, action, ["ver"]);
    },
    setPagesLoaded(state, action: SetStateDefaultReducerActionType) {
      setStateDefaultReducer(state, action, ["pagesLoaded"]);
    },
    setTotalPages(state, action: SetStateDefaultReducerActionType) {
      setStateDefaultReducer(state, action, ["totalPages"]);
    },
    setEquipments(state, action: SetStateDefaultReducerActionType) {
      setStateDefaultReducer(
        state,
        action,
        ["equipments"],
        defaultEquipmentsState
      );
    },
    setInputStateCreateNameReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "createEquipmentFields",
        "inputs",
        "name",
      ]);
    },
    setInputStateCreateSerialNumberReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "createEquipmentFields",
        "inputs",
        "serialNumber",
      ]);
    },
    setInputStateCreateCommentReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "createEquipmentFields",
        "inputs",
        "comment",
      ]);
    },
    setInputStateEditNameReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "editEquipmentFields",
        "inputs",
        "name",
      ]);
    },
    setInputStateEditSerialNumberReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "editEquipmentFields",
        "inputs",
        "serialNumber",
      ]);
    },
    setInputStateEditCommentReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "editEquipmentFields",
        "inputs",
        "comment",
      ]);
    },
  },
});

export const {
  setVer,
  setPagesLoaded,
  setTotalPages,
  setEquipments,
  setInputStateCreateNameReducer,
  setInputStateCreateSerialNumberReducer,
  setInputStateCreateCommentReducer,
  setInputStateEditNameReducer,
  setInputStateEditSerialNumberReducer,
  setInputStateEditCommentReducer,
} = slice.actions;

export default slice.reducer;
