import { Router } from 'express';
import { dropsToXrp } from 'xrpl';
import { withClient } from '../lib/with-client';

export const accountRouter = Router();

// GET /api/account/:address — 잔액과 시퀀스 조회
accountRouter.get('/:address', async (req, res) => {
  try {
    const data = await withClient(async (client) => {
      const info = await client.request({
        command: 'account_info',
        account: req.params.address,
        ledger_index: 'validated',
      });
      return {
        address: req.params.address,
        balanceXrp: dropsToXrp(info.result.account_data.Balance),
        sequence: info.result.account_data.Sequence,
      };
    });
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: err instanceof Error ? err.message : 'unknown' });
  }
});

// GET /api/account/:address/signers — 등록된 가디언 목록과 quorum
accountRouter.get('/:address/signers', async (req, res) => {
  try {
    const data = await withClient(async (client) => {
      const result = await client.request({
        command: 'account_objects',
        account: req.params.address,
        type: 'signer_list',
        ledger_index: 'validated',
      });
      const list = result.result.account_objects[0] as
        | {
            SignerQuorum: number;
            SignerEntries: { SignerEntry: { Account: string; SignerWeight: number } }[];
          }
        | undefined;
      if (!list) {
        return { address: req.params.address, registered: false as const };
      }
      return {
        address: req.params.address,
        registered: true as const,
        quorum: list.SignerQuorum,
        signers: list.SignerEntries.map((e) => ({
          address: e.SignerEntry.Account,
          weight: e.SignerEntry.SignerWeight,
        })),
      };
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'unknown' });
  }
});
