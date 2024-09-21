import { Draft } from "immer";
import {
  SetStateState,
  SetStateDefaultReducerActionType,
} from "@/store/helpers/state";

export const setStateDefaultReducer = (
  state: Draft<any>,
  action: SetStateDefaultReducerActionType,
  path: Array<string>
) => {
  const payload = action.payload;

  const stateByPath = path
    ? (path.reduce((result, item) => {
        if (!result) return undefined;
        if (!result?.[item]) return undefined;

        return result[item];
      }, state) as SetStateState)
    : undefined;

  if (!stateByPath) return;

  if (payload.action == "setData") stateByPath.data = payload.data;

  if (payload.action == "reset") stateByPath.data = null;
};
