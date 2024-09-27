import { DefaultStateType } from "@/store/helpers/state";

export interface DefaultInstallerStateType {
  id?: string;
  login: string;
  password: string;
  firstname: string;
  middlename: string;
  lastname: string;
  phone: string;
  status: "active" | "inactive";
  role?: string;
}

export interface DefaultInstallersStateType extends DefaultStateType {
  data: DefaultInstallerStateType[];
}

/*
export type SetStateDefaultReducerActionType = {
  payload: {
    action: "setData" | "reset";
    data?: any;
    params?: { [key: string]: any };
  };
  type: string;
};
*/
