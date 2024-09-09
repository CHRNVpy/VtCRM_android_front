import { Draft } from "immer";
import { PostState } from "./types";
import { defaultPostState } from "./defaultState";

export const postDefaultReducer = (
  state: Draft<any>,
  action: any,
  path: Array<string>
) => {
  const payload = action.payload;

  const stateByPath = path
    ? (path.reduce((result, item) => {
        if (!result) return undefined;
        if (!result?.[item]) return undefined;

        return result[item];
      }, state) as PostState)
    : undefined;

  if (stateByPath) {
    if (payload.action == "setAjaxCancel") {
      stateByPath.ajaxCancel = payload?.ajaxCancel;
    }

    if (payload.action == "reset") {
      if (stateByPath.ajaxCancel) stateByPath.ajaxCancel();

      stateByPath.ajaxCancel = defaultPostState.ajaxCancel;
      stateByPath.isError = defaultPostState.isError;
      stateByPath.errorFields = defaultPostState.errorFields;
      stateByPath.errorText = defaultPostState.errorText;
      stateByPath.isPostSending = defaultPostState.isPostSending;
      stateByPath.isPostDone = defaultPostState.isPostDone;
      stateByPath.responseData = defaultPostState.responseData;
    }
  }
};
