import { DefaultStateType } from "@/store/helpers/state";

export interface DefaultEquipmentStateType {
  id?: number;
  draftId?: number;
  name?: string;
  serialNumber: string;
  comment: string;
  status: "active" | "inactive";
  installerId?: number;
  applicationId?: number;
  hash?: string;
  isModified?: boolean;
}

export interface DefaultEquipmentsStateType extends DefaultStateType {
  data: DefaultEquipmentStateType[];
}
