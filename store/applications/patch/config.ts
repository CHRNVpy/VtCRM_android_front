import { createPatchAsyncThunk } from "@/store/helpers/patch";

export const reducerName = "patchApplication";

export const patchApplicationAsyncThunk = createPatchAsyncThunk({
  reducer: reducerName,
});
