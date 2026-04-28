import * as dotenv from 'dotenv';

dotenv.config();

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`환경변수 ${key} 가 설정되어 있지 않습니다. .env 파일을 확인하세요.`);
  return value;
};

const optional = (key: string, fallback: string): string => process.env[key] ?? fallback;

export const config = {
  network: optional('XRPL_NETWORK', 'wss://s.altnet.rippletest.net:51233'),
  senior: {
    address: optional('SENIOR_ADDRESS', ''),
    seed: optional('SENIOR_SEED', ''),
  },
  guardians: [
    { address: optional('GUARDIAN1_ADDRESS', ''), seed: optional('GUARDIAN1_SEED', '') },
    { address: optional('GUARDIAN2_ADDRESS', ''), seed: optional('GUARDIAN2_SEED', '') },
    { address: optional('GUARDIAN3_ADDRESS', ''), seed: optional('GUARDIAN3_SEED', '') },
  ],
  demo: {
    destination: optional('DEMO_DESTINATION', 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe'),
    amountXrp: optional('DEMO_AMOUNT_XRP', '1000'),
  },
};

export const requireSenior = () => ({
  address: required('SENIOR_ADDRESS'),
  seed: required('SENIOR_SEED'),
});

export const requireGuardians = () => [
  { address: required('GUARDIAN1_ADDRESS'), seed: required('GUARDIAN1_SEED') },
  { address: required('GUARDIAN2_ADDRESS'), seed: required('GUARDIAN2_SEED') },
  { address: required('GUARDIAN3_ADDRESS'), seed: required('GUARDIAN3_SEED') },
];
