import { Draft } from "immer";
import { PostState } from "./types";
import { defaultPostState } from "./defaultState";

export const postDefaultReducer = (
  state: Draft<any>,
  action: {
    payload: {
      action: "setAjaxCancel" | "reset";
      ajaxCancel: any;
      id?: number;
    };
  },
  path?: string[]
) => {
  const payload = action.payload;
  const id = payload.id;

  const stateByPathWithoutId = path
    ? (path.reduce((result, item) => {
        if (!result) return undefined;
        if (!result?.[item]) return undefined;

        return result[item];
      }, state) as any)
    : undefined;

  if (!stateByPathWithoutId) return;

  if (id && !stateByPathWithoutId[id])
    stateByPathWithoutId[id] = { ...defaultPostState };

  const stateByPath = id ? stateByPathWithoutId[id] : stateByPathWithoutId;

  if (payload.action == "setAjaxCancel") {
    stateByPath.ajaxCancel = payload?.ajaxCancel;
  }

  if (payload.action == "reset") {
    if (stateByPath.ajaxCancel) stateByPath.ajaxCancel();

    stateByPath.ajaxCancel = defaultPostState.ajaxCancel;
    stateByPath.isError = defaultPostState.isError;
    stateByPath.errorFields = defaultPostState.errorFields;
    stateByPath.errorText = defaultPostState.errorText;
    stateByPath.isInProcess = defaultPostState.isInProcess;
    stateByPath.isDone = defaultPostState.isDone;
    stateByPath.responseData = defaultPostState.responseData;
  }
};
