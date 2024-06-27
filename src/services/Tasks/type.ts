export interface TaskType {
  extendedData?: {
    [key: string]: { [key: string]: any };
  };
  taskId: string;
  taskType: number;
  propertyId: string;
  data: {
    bundleId: string;
    constraints: string;
    description: string;
    name: string;
    validUntil: number;
    isTemplate: boolean;
  };
  status: number;
}
// const newArray = Object.values(filterBundle).entries()
export interface TaskShortType {
  taskId: string;
  taskType: number;
  status: number;
  validUntil: number;
  constraints: string;
  comment?: string;
}
export interface BundleTaskType {
  bundleId: string;
  propertyId: string;
  name: string;
  status: string; //keyof typeof filterBundle;
  tasks: TaskShortType[];
  description?: string;
  isTemplate?: boolean;
  isNewsletter?: boolean;
  extendedData?: {
    [key: string]: { [key: string]: any };
  };
}

export interface TaskPayLoadType {
  status: string;
  comment?: string;
}
