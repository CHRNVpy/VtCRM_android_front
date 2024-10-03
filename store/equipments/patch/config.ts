import { createPatchAsyncThunk } from "@/store/helpers/patch";

export const reducerName = "patchEquipment";

export const patchEquipmentAsyncThunk = createPatchAsyncThunk({
  reducer: reducerName,
});
