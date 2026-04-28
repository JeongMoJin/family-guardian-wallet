import { Router } from 'express';
import { dropsToXrp } from 'xrpl';
import { withClient } from '../lib/with-client';
import { config } from '../../config';
import { explorerTxUrl } from '../../xrpl/client';
import {
  buildMultisigPayment,
  combineGuardianSignatures,
  signAsGuardian,
} from '../../xrpl/multisign';
import { guardianWalletByAddress } from '../lib/signer-pool';
import {
  createRequest,
  getRequest,
  listRequests,
  updateRequest,
  type SigningRequest,
} from '../lib/store';

export const signingRouter = Router();

const toView = (r: SigningRequest) => ({
  id: r.id,
  fromAddress: r.fromAddress,
  toAddress: r.toAddress,
  amountXrp: r.amountXrp,
  quorum: r.quorum,
  approvals: r.partialSignatures.map((p) => ({
    guardianAddress: p.guardianAddress,
    signedAt: p.signedAt,
  })),
  status: r.status,
  txHash: r.txHash,
  explorerUrl: r.explorerUrl,
  errorMessage: r.errorMessage,
  createdAt: r.createdAt,
  updatedAt: r.updatedAt,
});

// POST /api/signing-requests
// 시니어가 송금 요청을 만든다. 서버가 prepared tx를 autofill해 quorum개 서명 fee를 미리 잡는다.
signingRouter.post('/', async (req, res) => {
  try {
    const { toAddress, amountXrp } = req.body as { toAddress?: string; amountXrp?: string };
    if (!toAddress || !amountXrp) {
      return res.status(400).json({ error: 'toAddress, amountXrp는 필수입니다.' });
    }
    if (!config.senior.address) {
      return res.status(500).json({ error: '서버에 SENIOR_ADDRESS가 설정되어 있지 않습니다.' });
    }

    const created = await withClient(async (client) => {
      const objs = await client.request({
        command: 'account_objects',
        account: config.senior.address,
        type: 'signer_list',
        ledger_index: 'validated',
      });
      const list = objs.result.account_objects[0] as
        | { SignerQuorum: number }
        | undefined;
      if (!list) throw new Error('시니어 계정에 SignerList가 등록되어 있지 않습니다.');
      const quorum = list.SignerQuorum;

      const preparedTx = await buildMultisigPayment(client, {
        from: config.senior.address,
        to: toAddress,
        amountXrp,
        signerCount: quorum,
      });

      return createRequest({
        fromAddress: config.senior.address,
        toAddress,
        amountXrp,
        quorum,
        preparedTx,
      });
    });

    res.status(201).json(toView(created));
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'unknown' });
  }
});

// GET /api/signing-requests
signingRouter.get('/', (_req, res) => {
  res.json(listRequests().map(toView));
});

// GET /api/signing-requests/:id
signingRouter.get('/:id', (req, res) => {
  const r = getRequest(req.params.id);
  if (!r) return res.status(404).json({ error: 'not found' });
  res.json(toView(r));
});

// POST /api/signing-requests/:id/sign
// 가디언 한 명의 부분 서명을 추가한다. quorum이 채워지면 자동으로 multisign 결합·제출까지 한다.
signingRouter.post('/:id/sign', async (req, res) => {
  try {
    const r = getRequest(req.params.id);
    if (!r) return res.status(404).json({ error: 'not found' });
    if (r.status !== 'pending') {
      return res.status(409).json({ error: `이미 ${r.status} 상태인 요청입니다.` });
    }

    const { guardianAddress } = req.body as { guardianAddress?: string };
    if (!guardianAddress) return res.status(400).json({ error: 'guardianAddress는 필수입니다.' });

    if (r.partialSignatures.some((p) => p.guardianAddress === guardianAddress)) {
      return res.status(409).json({ error: '이미 서명한 가디언입니다.' });
    }

    const wallet = guardianWalletByAddress(guardianAddress);
    if (!wallet) return res.status(400).json({ error: '등록된 가디언 주소가 아닙니다.' });

    const txBlob = signAsGuardian(wallet, r.preparedTx);
    r.partialSignatures.push({ guardianAddress, txBlob, signedAt: Date.now() });

    if (r.partialSignatures.length < r.quorum) {
      const updated = updateRequest(r.id, { partialSignatures: r.partialSignatures });
      return res.json(toView(updated!));
    }

    // quorum 충족 → 결합·제출
    try {
      const combined = combineGuardianSignatures(r.partialSignatures.map((p) => p.txBlob));
      const result = await withClient(async (client) => client.submitAndWait(combined));
      const meta = result.result.meta;
      const code = typeof meta === 'object' && meta && 'TransactionResult' in meta
        ? (meta as { TransactionResult: string }).TransactionResult
        : 'unknown';
      const hash = result.result.hash;
      if (code === 'tesSUCCESS') {
        const updated = updateRequest(r.id, {
          partialSignatures: r.partialSignatures,
          status: 'submitted',
          txHash: hash,
          explorerUrl: explorerTxUrl(hash),
        });
        return res.json(toView(updated!));
      }
      const updated = updateRequest(r.id, {
        partialSignatures: r.partialSignatures,
        status: 'failed',
        txHash: hash,
        explorerUrl: explorerTxUrl(hash),
        errorMessage: `testnet 응답: ${code}`,
      });
      return res.json(toView(updated!));
    } catch (err) {
      const updated = updateRequest(r.id, {
        partialSignatures: r.partialSignatures,
        status: 'failed',
        errorMessage: err instanceof Error ? err.message : 'unknown',
      });
      return res.status(500).json(toView(updated!));
    }
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'unknown' });
  }
});

// GET /api/signing-requests/_meta/balance/:address — 폴링 편의용 잔액 조회 래퍼
signingRouter.get('/_meta/balance/:address', async (req, res) => {
  try {
    const data = await withClient(async (client) => {
      const info = await client.request({
        command: 'account_info',
        account: req.params.address,
        ledger_index: 'validated',
      });
      return { balanceXrp: dropsToXrp(info.result.account_data.Balance) };
    });
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: err instanceof Error ? err.message : 'unknown' });
  }
});
