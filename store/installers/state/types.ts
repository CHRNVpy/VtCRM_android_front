import { DefaultStateType } from "@/store/helpers/state";

export interface DefaultInstallerStateType {
  id?: number;
  draftId?: number;
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
