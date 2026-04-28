const BASE = '/api';

export interface GuardianConfig {
  label: string;
  address: string;
}

export interface AppConfig {
  seniorAddress: string | null;
  network: string;
  guardians: GuardianConfig[];
  demoDestination: string;
}

export interface AccountInfo {
  address: string;
  balanceXrp: string;
  sequence: number;
}

export interface SignerListInfo {
  address: string;
  registered: boolean;
  quorum?: number;
  signers?: { address: string; weight: number }[];
}

export type SigningRequestStatus = 'pending' | 'submitted' | 'failed';

export interface SigningRequestApproval {
  guardianAddress: string;
  signedAt: number;
}

export interface SigningRequestView {
  id: string;
  fromAddress: string;
  toAddress: string;
  amountXrp: string;
  quorum: number;
  approvals: SigningRequestApproval[];
  status: SigningRequestStatus;
  txHash?: string;
  explorerUrl?: string;
  errorMessage?: string;
  createdAt: number;
  updatedAt: number;
}

const json = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
};

export const fetchConfig = (): Promise<AppConfig> =>
  fetch(`${BASE}/config`).then((r) => json<AppConfig>(r));

export const fetchAccount = (address: string): Promise<AccountInfo> =>
  fetch(`${BASE}/account/${address}`).then((r) => json<AccountInfo>(r));

export const fetchSigners = (address: string): Promise<SignerListInfo> =>
  fetch(`${BASE}/account/${address}/signers`).then((r) => json<SignerListInfo>(r));

export const createSigningRequest = (input: {
  toAddress: string;
  amountXrp: string;
}): Promise<SigningRequestView> =>
  fetch(`${BASE}/signing-requests`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  }).then((r) => json<SigningRequestView>(r));

export const listSigningRequests = (): Promise<SigningRequestView[]> =>
  fetch(`${BASE}/signing-requests`).then((r) => json<SigningRequestView[]>(r));

export const approveSigningRequest = (
  id: string,
  guardianAddress: string,
): Promise<SigningRequestView> =>
  fetch(`${BASE}/signing-requests/${id}/sign`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ guardianAddress }),
  }).then((r) => json<SigningRequestView>(r));
