import { Draft } from "immer";
import {
  DefaultStateType,
  SetStateDefaultReducerActionType,
} from "@/store/helpers/state/types";
import { defaultState } from "@/store/helpers/state/defaultState";

export const setStateDefaultReducer = (
  state: Draft<any>,
  action: SetStateDefaultReducerActionType,
  path: Array<string>,
  externalDefaultState?: any //  На случай использования стороннего defaultState
) => {
  const payload = action.payload;

  const stateByPath = path
    ? (path.reduce((result, item) => {
        if (!result) return undefined;
        if (!result?.[item]) return undefined;

        return result[item];
      }, state) as DefaultStateType)
    : undefined;

  if (!stateByPath) return;

  if (payload.action == "setData") {
    stateByPath.data = payload.data;
    stateByPath.params = payload.params
      ? payload.params
      : externalDefaultState?.params
      ? externalDefaultState?.params
      : defaultState.params;
  }

  if (payload.action == "reset") {
    stateByPath.data = externalDefaultState?.data
      ? externalDefaultState?.data
      : defaultState.data;
    stateByPath.params = externalDefaultState?.params
      ? externalDefaultState?.params
      : defaultState.params;
  }
};
