import { createPostAsyncThunk } from "@/store/helpers/post";

export const reducerName = "postInstaller";

export const postInstallerAsyncThunk = createPostAsyncThunk({
  reducer: reducerName,
});
