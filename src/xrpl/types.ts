export interface Account {
  address: string;
  seed: string;
}

export interface SignerEntryConfig {
  address: string;
  weight: number;
}

export interface MultisigPaymentRequest {
  from: string;
  to: string;
  amountXrp: string;
  signerCount: number;
}
