import { PostState } from "./types";

export const defaultPostState: PostState = {
  ajaxCancel: null,
  isError: false,
  errorFields: null,
  errorText: "",
  isInProcess: false,
  isDone: false,
  responseData: undefined,
};
