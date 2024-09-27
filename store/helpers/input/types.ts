export interface InputStateType {
  text: string;
}

export type InputStateDefaultReducerActionType = {
  payload: {
    action: "setText" | "reset";
    text?: any;
  };
  type: string;
};
