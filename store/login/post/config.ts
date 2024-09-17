import { createPostAsyncThunk } from "@/store/helpers/post";

export const reducerName = "postLogin";

export const postLoginAsyncThunk = createPostAsyncThunk({
  reducer: reducerName,
});
