import { PostState } from "./types";

export const defaultPostState: PostState = {
  ajaxCancel: null,
  isError: false,
  errorFields: null,
  errorText: "",
  isPostSending: false,
  isPostDone: false,
  responseData: undefined,
};
