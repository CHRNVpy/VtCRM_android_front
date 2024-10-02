import { Draft } from "immer";
import { PatchState } from "@/store/helpers/patch/types";
import { defaultPatchState } from "@/store/helpers/patch/defaultState";

//  Default patchDefaultReducer
export const patchDefaultReducer = (
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
      }, state) as { [key: string]: PatchState })
    : undefined;

  if (!stateByPathWithoutId) return;

  if (id && !stateByPathWithoutId[id])
    stateByPathWithoutId[id] = { ...defaultPatchState };

  const stateByPath = id ? stateByPathWithoutId[id] : stateByPathWithoutId;

  if (payload.action == "setAjaxCancel") {
    stateByPath.ajaxCancel = payload?.ajaxCancel;
  }

  if (payload.action == "reset") {
    if (stateByPath.ajaxCancel && typeof stateByPath.ajaxCancel === "function")
      stateByPath.ajaxCancel();

    stateByPath.ajaxCancel = defaultPatchState.ajaxCancel;
    stateByPath.isError = defaultPatchState.isError;
    stateByPath.errorFields = defaultPatchState.errorFields;
    stateByPath.errorText = defaultPatchState.errorText;
    stateByPath.isInProcess = defaultPatchState.isInProcess;
    stateByPath.isDone = defaultPatchState.isDone;
    stateByPath.responseData = defaultPatchState.responseData;
  }
};
