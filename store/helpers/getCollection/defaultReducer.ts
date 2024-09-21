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

  const stateByPath = path
    ? (path.reduce((result, item) => {
        if (!result) return undefined;
        if (!result?.[item]) return undefined;

        return result[item];
      }, state) as GetCollectionState)
    : undefined;

  if (!stateByPath) return;

  if (payload.action == "setAjaxCancel") {
    stateByPath.ajaxCancel = payload?.data;
  }

  if (payload.action == "setPage") {
    stateByPath.page = payload?.data;
  }

  if (payload.action == "setFilters") {
    stateByPath.filters = payload?.data;
  }

  if (payload.action == "reset") {
    if (stateByPath?.ajaxCancel) stateByPath?.ajaxCancel();

    stateByPath.data = defaultGetCollectionState.data;
    stateByPath.variables = defaultGetCollectionState.variables;
    stateByPath.totalRows = defaultGetCollectionState.totalRows;
    stateByPath.page = defaultGetCollectionState.page;
    stateByPath.perPage = defaultGetCollectionState.perPage;
    stateByPath.ajaxCancel = defaultGetCollectionState.ajaxCancel;
    stateByPath.isInProcess = defaultGetCollectionState.isInProcess;
    stateByPath.isLoaded = defaultGetCollectionState.isLoaded;
  }
};
