export interface BankAccount {
  iban: string;
  bic: string;
  bank: string;
}
export interface PaymentAccountType {
  accountHolder: string;
  accountNumber: string;
  expiryMonth: string;
  expiryYear: string;
  isActive: true;
  isVirtual: false;
  payerEmail: string;
  paymentMethod: string;
  cvv: string;
}
