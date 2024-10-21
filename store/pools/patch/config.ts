import { createPatchAsyncThunk } from "@/store/helpers/patch";

export const reducerName = "patchPool";

export const patchPoolAsyncThunk = createPatchAsyncThunk({
  reducer: reducerName,
});
