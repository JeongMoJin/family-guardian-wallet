import { Client, SignerListSet, Wallet } from 'xrpl';
import { SignerEntryConfig } from './types';

export interface SignerListConfig {
  client: Client;
  ownerWallet: Wallet;
  signers: SignerEntryConfig[];
  quorum: number;
}

// SignerListSet: 시니어 계정에 가디언 목록과 quorum을 등록
export const setSignerList = async ({ client, ownerWallet, signers, quorum }: SignerListConfig) => {
  const tx: SignerListSet = {
    TransactionType: 'SignerListSet',
    Account: ownerWallet.address,
    SignerQuorum: quorum,
    SignerEntries: signers.map(({ address, weight }) => ({
      SignerEntry: { Account: address, SignerWeight: weight },
    })),
  };

  const prepared = await client.autofill(tx);
  const signed = ownerWallet.sign(prepared);
  return client.submitAndWait(signed.tx_blob);
};
