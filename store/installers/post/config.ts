import { createPostAsyncThunk } from "@/store/helpers/post";

export const reducerName = "postInstallers";

export const postLoginAsyncThunk = createPostAsyncThunk({
  reducer: reducerName,
});
