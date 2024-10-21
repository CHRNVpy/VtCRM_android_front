import { Draft } from "immer";
import {
  GetCollectionState,
  GetCollectionDefaultReducerActionType,
} from "@/store/helpers/getCollection/types";
import { defaultGetCollectionState } from "@/store/helpers/getCollection/defaultState";

//  Default setGetCollectionStateDefaultReducer
export const setGetCollectionStateDefaultReducer = (
  state: Draft<any>,
  action: GetCollectionDefaultReducerActionType,
  path: Array<string>
) => {
  const payload = action.payload;
  const page = payload.page ? payload.page.toString() : "0";

  const stateByPathWithoutPage = path
    ? (path.reduce((result, item) => {
        if (!result) return undefined;
        if (!result?.[item]) return undefined;

        return result[item];
      }, state) as { [key: string]: GetCollectionState })
    : undefined;

  if (!stateByPathWithoutPage) return;

  if (!stateByPathWithoutPage[page])
    stateByPathWithoutPage[page] = { ...defaultGetCollectionState };

  const stateByPath = stateByPathWithoutPage[page];

  if (!stateByPath) return;

  if (payload.action == "setAjaxCancel") {
    stateByPath.ajaxCancel = payload?.data;
  }

  if (payload.action == "reset") {
    if (stateByPath.ajaxCancel && typeof stateByPath.ajaxCancel === "function")
      stateByPath.ajaxCancel();

    stateByPath.data = defaultGetCollectionState.data;
    stateByPath.ajaxCancel = defaultGetCollectionState.ajaxCancel;
    stateByPath.isInProcess = defaultGetCollectionState.isInProcess;
    stateByPath.isLoaded = defaultGetCollectionState.isLoaded;
  }
};
