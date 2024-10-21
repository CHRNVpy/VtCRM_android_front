import { DefaultStateType } from "@/store/helpers/state";

export interface DefaultEquipmentStateType {
  id?: number;
  draftId?: number;
  page?: number;
  ver?: number;
  name?: string;
  serialNumber: string;
  comment: string;
  installerId?: number;
  applicationId?: number;
  applicationDraftId?: number;
  hash?: string;
  isModified?: boolean;
}

export interface DefaultEquipmentsStateType extends DefaultStateType {
  data: DefaultEquipmentStateType[];
}
