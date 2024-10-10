import { DefaultStateType } from "@/store/helpers/state";

export interface Image {
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
  type?: "connection" | "repair" | "line setup";
  client?: {
    number?: string;
    fullName?: string;
    phone?: string;
    address?: string;
    email?: string;
  };
  address?: string;
  installerId?: number;
  comment: string;
  status?: "active" | "pending" | "finished" | "cancelled";
  installDate: string;
  poolId?: number;
  images: Image[];
  page?: number;
  ver?: number;
  hash?: string;
  isModified?: boolean;
}

export interface DefaultApplicationsStateType extends DefaultStateType {
  data: DefaultApplicationStateType[];
}
