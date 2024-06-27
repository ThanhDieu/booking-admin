export interface VoucherValidPayload {
  propertyId: string;
  vouchers: string[];
}

export interface VoucherType {
  voucherId: string;
  code: string;
  status: string;
  voucherData: {
    value: number;
    currency: string;
    hotel: string;
    date: number;
    email: string;
    validity: number;
  };
}

export interface VoucherCreatePayload {
  currency: string;
  email: string;
  hotel?: string;
  value: number;
}
