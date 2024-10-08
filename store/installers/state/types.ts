import { DefaultStateType } from "@/store/helpers/state";

export interface DefaultInstallerStateType {
  id?: number;
  draftId?: number;
  login?: string;
  password: string;
  firstname: string;
  middlename: string;
  lastname: string;
  phone: string;
  status: "active" | "inactive";
  role?: string;
  hash?: string;
  isModified?: boolean;
}

export interface DefaultInstallersStateType extends DefaultStateType {
  data: DefaultInstallerStateType[];
}
