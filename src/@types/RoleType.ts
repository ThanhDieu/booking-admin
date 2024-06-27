import { ExtendedDataType } from "./BaseType";

export interface RoleType {
  name: string;
  roleId?: string;
  color: string;
  comment: string;

  id: string;
  updated_at: number;
  created_at: number;
  priority: number;
  title?: string;
  extendedData?: ExtendedDataType
}
