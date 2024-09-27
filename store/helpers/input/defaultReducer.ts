import { Draft } from "immer";
import {
  InputStateDefaultReducerActionType,
  InputStateType,
} from "@/store/helpers/input";

export const setInputStateDefaultReducer = (
  state: Draft<any>,
  action: InputStateDefaultReducerActionType,
  path: Array<string>
) => {
  const payload = action.payload;

  const stateByPath = path
    ? (path.reduce((result, item) => {
        if (!result) return undefined;
        if (!result?.[item]) return undefined;

        return result[item];
      }, state) as InputStateType)
    : undefined;

  if (stateByPath) {
    if (payload.action == "setText") stateByPath.text = payload.text;
    if (payload.action == "reset") stateByPath.text = "";
  }
};
