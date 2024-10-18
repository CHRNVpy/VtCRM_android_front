import { DefaultStateType } from "@/store/helpers/state";

export interface ApplicationInstallerType {
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
}

export interface ApplicationEquipmentType {
  id: number;
  rowNum: number;
  name: string;
  serialNumber: string;
  comment?: string;
  applicationId?: number;
  installerId?: number;
  hash: string;
}

export interface ApplicationImageType {
  id?: number;
  name?: number;
  mimeType: string;
  width: number;
  height: number;
  size: number;
  path: string;
  installerId: number;
  applicationId: number;
}

export interface DefaultApplicationStateType {
  id?: number;
  draftId?: number;
  type: "connection" | "repair" | "line setup";
  client?: {
    account?: string;
    fullName?: string;
    phone?: string;
    address?: string;
    email?: string;
  };
  address?: string;
  installer?: ApplicationInstallerType;
  comment: string;
  status: "active" | "pending" | "finished" | "approved" | "cancelled";
  installDate: string;
  poolId?: number;
  images?: ApplicationImageType[];
  equipments?: ApplicationEquipmentType[];
  page?: number;
  ver?: number;
  hash?: string;
  isModified?: boolean;
}

export interface DefaultApplicationsStateType extends DefaultStateType {
  data: DefaultApplicationStateType[];
}
