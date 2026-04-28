import { Wallet } from 'xrpl';
import { createClient, explorerTxUrl } from '../xrpl/client';
import { setSignerList } from '../xrpl/setup-signers';
import { requireSenior, requireGuardians } from '../config';

const QUORUM = 2;

const main = async () => {
  const senior = requireSenior();
  const guardians = requireGuardians();
  const seniorWallet = Wallet.fromSeed(senior.seed);

  const client = createClient();
  await client.connect();

  console.log(`시니어 계정     : ${seniorWallet.address}`);
  console.log(`가디언 ${guardians.length}명 등록 (SignerWeight=1, SignerQuorum=${QUORUM}):`);
  guardians.forEach((g, i) => console.log(`  guardian${i + 1}     : ${g.address}`));

  const result = await setSignerList({
    client,
    ownerWallet: seniorWallet,
    signers: guardians.map((g) => ({ address: g.address, weight: 1 })),
    quorum: QUORUM,
  });

  const meta = result.result.meta;
  const code = typeof meta === 'object' && meta !== null ? meta.TransactionResult : 'unknown';

  console.log('');
  console.log(`결과            : ${code}`);
  console.log(`tx hash         : ${result.result.hash}`);
  console.log(`explorer        : ${explorerTxUrl(result.result.hash)}`);

  await client.disconnect();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
