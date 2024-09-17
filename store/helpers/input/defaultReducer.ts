import { Draft } from "immer";
import { InputState } from "@/store/helpers/input";

export const setInputStateDefaultReducer = (
  state: Draft<any>,
  action: {
    payload: any;
    type: string;
  },
  path: Array<string>
) => {
  const payload = action.payload;

  console.log(payload);

  const stateByPath = path
    ? (path.reduce((result, item) => {
        if (!result) return undefined;
        if (!result?.[item]) return undefined;

        return result[item];
      }, state) as InputState)
    : undefined;

  if (stateByPath) {
    if (payload.action == "setText") stateByPath.text = payload.text;

    if (payload.action == "clear") stateByPath.text = "";

    if (payload.action == "setIsDisabled")
      stateByPath.isDisabled = payload.isDisabled;

    if (payload.action == "setIsVisible")
      stateByPath.isVisible = payload.isVisible;

    if (payload.action == "switchVisibility")
      stateByPath.isVisible = !stateByPath.isVisible;
  }
};
