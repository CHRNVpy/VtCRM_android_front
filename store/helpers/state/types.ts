export interface DefaultStateType {
  data: any;
  params: any;
}

export type SetStateDefaultReducerActionType = {
  payload: {
    action: "setData" | "reset";
    data?: any;
    params?: { [key: string]: any };
  };
  type: string;
};
