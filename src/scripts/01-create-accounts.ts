import { Client } from 'xrpl';
import { writeFileSync, existsSync, copyFileSync } from 'fs';
import * as path from 'path';

const NETWORK = process.env.XRPL_NETWORK ?? 'wss://s.altnet.rippletest.net:51233';
const ROLES = ['SENIOR', 'GUARDIAN1', 'GUARDIAN2', 'GUARDIAN3'] as const;

const fundOne = async (client: Client, role: string) => {
  const { wallet, balance } = await client.fundWallet();
  console.log(`  ${role.padEnd(10)} ${wallet.address}  (${balance} XRP)`);
  return { role, address: wallet.address, seed: wallet.seed ?? '' };
};

const renderEnv = (entries: { role: string; address: string; seed: string }[]) => {
  const lines = [`XRPL_NETWORK=${NETWORK}`, ''];
  for (const { role, address, seed } of entries) {
    lines.push(`${role}_ADDRESS=${address}`);
    lines.push(`${role}_SEED=${seed}`);
    lines.push('');
  }
  lines.push('DEMO_DESTINATION=');
  lines.push('DEMO_AMOUNT_XRP=1000');
  return lines.join('\n') + '\n';
};

const main = async () => {
  const client = new Client(NETWORK);
  await client.connect();
  console.log(`testnet 연결: ${NETWORK}\n`);
  console.log('계정 4개 faucet 으로 생성:');

  const entries = [];
  for (const role of ROLES) {
    entries.push(await fundOne(client, role));
  }

  await client.disconnect();

  const envPath = path.resolve(process.cwd(), '.env');
  if (existsSync(envPath)) {
    copyFileSync(envPath, `${envPath}.bak`);
    console.log(`\n기존 .env 를 .env.bak 으로 백업했습니다.`);
  }
  writeFileSync(envPath, renderEnv(entries));
  console.log(`.env 저장 완료: ${envPath}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
