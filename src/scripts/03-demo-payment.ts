import { Wallet } from 'xrpl';
import { createClient, explorerTxUrl } from '../xrpl/client';
import {
  buildMultisigPayment,
  combineGuardianSignatures,
  signAsGuardian,
} from '../xrpl/multisign';
import { config, requireGuardians, requireSenior } from '../config';

const extractCode = (meta: unknown): string =>
  typeof meta === 'object' && meta !== null && 'TransactionResult' in meta
    ? String((meta as { TransactionResult: string }).TransactionResult)
    : 'unknown';

const printResult = (hash: string, code: string) => {
  console.log(`  결과         : ${code}`);
  console.log(`  tx hash      : ${hash}`);
  console.log(`  explorer     : ${explorerTxUrl(hash)}`);
};

const main = async () => {
  const senior = requireSenior();
  const guardians = requireGuardians();
  const seniorAddress = senior.address;

  const g1 = Wallet.fromSeed(guardians[0].seed);
  const g2 = Wallet.fromSeed(guardians[1].seed);

  const { destination, amountXrp } = config.demo;

  const client = createClient();
  await client.connect();

  console.log(`송금 시도        : ${seniorAddress}`);
  console.log(`수신자           : ${destination}`);
  console.log(`금액             : ${amountXrp} XRP`);
  console.log('');

  // 멀티시그 트랜잭션 골격 (서명자 2명 기준 fee 산정)
  const prepared = await buildMultisigPayment(client, {
    from: seniorAddress,
    to: destination,
    amountXrp,
    signerCount: 2,
  });

  // 케이스 1: 가디언 1명만 서명 → quorum 미달
  console.log('[케이스 1] 가디언 1명 서명 → quorum 미달 예상');
  const onlyOne = combineGuardianSignatures([signAsGuardian(g1, prepared)]);
  try {
    const failResult = await client.submitAndWait(onlyOne);
    printResult(failResult.result.hash, extractCode(failResult.result.meta));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.log(`  거부됨        : ${message}`);
  }
  console.log('');

  // 케이스 2: 가디언 2명 서명 → quorum 달성, testnet 제출 성공
  console.log('[케이스 2] 가디언 2명 서명 → quorum 달성 예상');
  const combined = combineGuardianSignatures([
    signAsGuardian(g1, prepared),
    signAsGuardian(g2, prepared),
  ]);
  const okResult = await client.submitAndWait(combined);
  printResult(okResult.result.hash, extractCode(okResult.result.meta));

  await client.disconnect();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
