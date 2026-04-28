import { Router } from 'express';
import { Wallet } from 'xrpl';
import { withClient } from '../lib/with-client';
import { config } from '../../config';

// POST /api/faucet — 시니어 계정에 testnet faucet으로 추가 XRP 충전.
// 시연 중 잔액이 부족할 때 자동으로 호출된다.
export const faucetRouter = Router();

faucetRouter.post('/', async (_req, res) => {
  try {
    if (!config.senior.seed) {
      return res.status(500).json({ error: '시니어 시드가 설정되어 있지 않습니다.' });
    }
    const data = await withClient(async (client) => {
      const wallet = Wallet.fromSeed(config.senior.seed);
      const result = await client.fundWallet(wallet);
      return { address: wallet.address, balanceXrp: result.balance };
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'unknown' });
  }
});
