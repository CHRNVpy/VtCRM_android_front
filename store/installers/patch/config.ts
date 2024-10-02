import { createPatchAsyncThunk } from "@/store/helpers/patch";

export const reducerName = "patchInstaller";

export const patchInstallerAsyncThunk = createPatchAsyncThunk({
  reducer: reducerName,
});
