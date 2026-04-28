import type { Payment } from 'xrpl';

export type SigningRequestStatus = 'pending' | 'submitted' | 'failed';

export interface PartialSignature {
  guardianAddress: string;
  txBlob: string;
  signedAt: number;
}

export interface SigningRequest {
  id: string;
  fromAddress: string;
  toAddress: string;
  amountXrp: string;
  quorum: number;
  preparedTx: Payment;
  partialSignatures: PartialSignature[];
  status: SigningRequestStatus;
  txHash?: string;
  explorerUrl?: string;
  errorMessage?: string;
  createdAt: number;
  updatedAt: number;
}

const requests = new Map<string, SigningRequest>();

const newId = (): string => {
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `req_${stamp}${rand}`;
};

export const createRequest = (input: {
  fromAddress: string;
  toAddress: string;
  amountXrp: string;
  quorum: number;
  preparedTx: Payment;
}): SigningRequest => {
  const now = Date.now();
  const req: SigningRequest = {
    id: newId(),
    ...input,
    partialSignatures: [],
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };
  requests.set(req.id, req);
  return req;
};

export const getRequest = (id: string): SigningRequest | undefined => requests.get(id);

export const listRequests = (): SigningRequest[] =>
  [...requests.values()].sort((a, b) => b.createdAt - a.createdAt);

export const updateRequest = (
  id: string,
  patch: Partial<Omit<SigningRequest, 'id' | 'createdAt'>>,
): SigningRequest | undefined => {
  const cur = requests.get(id);
  if (!cur) return undefined;
  const next = { ...cur, ...patch, updatedAt: Date.now() };
  requests.set(id, next);
  return next;
};

export const resetStore = () => requests.clear();
