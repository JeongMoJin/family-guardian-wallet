import { Wallet } from 'xrpl';
import { config } from '../../config';

// 가디언 시드는 서버 env에만 두고 외부에 노출하지 않는다.
// 클라이언트는 가디언 주소만 보내고, 서버가 그 주소에 매칭되는 wallet으로 서명한다.
// PoC 단순화: 실제 서비스에서는 가디언 디바이스에서 서명 후 서버에 partial blob을 전달.
export const guardianWalletByAddress = (address: string): Wallet | undefined => {
  for (const g of config.guardians) {
    if (!g.address || !g.seed) continue;
    if (g.address === address) return Wallet.fromSeed(g.seed);
  }
  return undefined;
};

export const seniorWallet = (): Wallet | undefined => {
  if (!config.senior.seed) return undefined;
  return Wallet.fromSeed(config.senior.seed);
};
