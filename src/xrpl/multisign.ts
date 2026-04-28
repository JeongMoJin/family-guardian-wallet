import { Client, multisign, Payment, Wallet, xrpToDrops } from 'xrpl';
import { MultisigPaymentRequest } from './types';

// 멀티시그용 Payment 트랜잭션 골격을 만들고 autofill 단계에서 서명자 수를 반영해 fee를 산정한다.
export const buildMultisigPayment = async (
  client: Client,
  { from, to, amountXrp, signerCount }: MultisigPaymentRequest,
): Promise<Payment> => {
  const tx: Payment = {
    TransactionType: 'Payment',
    Account: from,
    Destination: to,
    Amount: xrpToDrops(amountXrp),
  };
  return client.autofill(tx, signerCount);
};

// 가디언 한 명의 부분 서명. wallet.sign(tx, true) 의 두 번째 인자가 multisign 모드.
export const signAsGuardian = (wallet: Wallet, tx: Payment): string =>
  wallet.sign(tx, true).tx_blob;

// 부분 서명들을 결합해 하나의 멀티시그 트랜잭션 blob 으로 만든다.
export const combineGuardianSignatures = (signedBlobs: string[]): string =>
  multisign(signedBlobs);
