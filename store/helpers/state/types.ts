export interface SetStateState {
  data: any;
}

export type SetStateDefaultReducerActionType = {
  payload: { action: "setData" | "reset"; data?: any };
  type: string;
};
