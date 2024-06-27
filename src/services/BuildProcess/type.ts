export interface BuildProcessType {
  buildId: string;
  status: string;
  timeStart?: string;
  timeEnd?: string;
  buildLog?: string;
}

export interface StatusTrigger {
  status: string;
  message: string;
}
