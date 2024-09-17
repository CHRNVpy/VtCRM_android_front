import { Draft } from "immer";
import { State } from "@/store/helpers/state";

export const setStateDefaultReducer = (
  state: Draft<any>,
  action: {
    payload: any;
    type: string;
  },
  path: Array<string>
) => {
  const payload = action.payload;

  const stateByPath = path
    ? (path.reduce((result, item) => {
        if (!result) return undefined;
        if (!result?.[item]) return undefined;

        return result[item];
      }, state) as State)
    : undefined;

  if (stateByPath) {
    if (payload.action == "setData") stateByPath.data = payload.data;

    if (payload.action == "clear") stateByPath.data = null;
  }
};
