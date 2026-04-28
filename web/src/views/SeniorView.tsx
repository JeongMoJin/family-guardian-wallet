import { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  createSigningRequest,
  fetchAccount,
  fetchSigners,
  listSigningRequests,
  type AccountInfo,
  type SignerListInfo,
  type SigningRequestView,
} from '../lib/api';

interface Props {
  address: string;
  defaultDestination: string;
  compact?: boolean;
}

const statusBadge = (s: SigningRequestView['status']) => {
  if (s === 'submitted') return { text: '송금 완료', cls: 'bg-senior-goodSoft text-senior-good' };
  if (s === 'failed') return { text: '실패', cls: 'bg-senior-warnSoft text-senior-warn' };
  return { text: '가족 승인 기다리는 중', cls: 'bg-senior-accent/15 text-senior-accentDeep' };
};

export const SeniorView = ({ address, defaultDestination, compact = false }: Props) => {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [signers, setSigners] = useState<SignerListInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [toAddress, setToAddress] = useState(defaultDestination);
  const [amount, setAmount] = useState('50');
  const [submitting, setSubmitting] = useState(false);
  const [latest, setLatest] = useState<SigningRequestView | null>(null);

  // 잔액·가디언 목록 5초 주기 갱신
  useEffect(() => {
    let alive = true;
    const load = () => {
      Promise.all([fetchAccount(address), fetchSigners(address)])
        .then(([a, s]) => {
          if (!alive) return;
          setAccount(a);
          setSigners(s);
        })
        .catch((e: Error) => alive && setError(e.message));
    };
    load();
    const t = setInterval(load, 5000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [address]);

  // 본인이 만든 가장 최근 요청 폴링 (시연 모드에서 자동 시연이 만든 요청도 잡음)
  useEffect(() => {
    let alive = true;
    const tick = () => {
      listSigningRequests()
        .then((all) => {
          if (!alive) return;
          const mine = all.filter((r) => r.fromAddress === address);
          if (mine.length > 0) setLatest(mine[0]);
        })
        .catch(() => {});
    };
    tick();
    const t = setInterval(tick, 1500);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [address]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!toAddress || !amount) {
      setError('받는 분 주소와 금액을 입력해 주세요.');
      return;
    }
    setSubmitting(true);
    try {
      const created = await createSigningRequest({ toAddress, amountXrp: amount });
      setLatest(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : '요청 생성 실패');
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = signers?.registered && !submitting;

  return (
    <main className={clsx(compact ? 'p-5 space-y-5' : 'max-w-3xl mx-auto px-6 py-10 space-y-7')}>
      {error && (
        <div className="rounded-xl border border-senior-bad/30 bg-senior-warnSoft px-5 py-4 text-senior-bad text-sm">
          {error}
        </div>
      )}

      <section>
        <p className="text-senior-muted text-sm">내 잔액</p>
        <p className="text-4xl md:text-5xl font-black text-senior-ink mt-1">
          {account ? `${account.balanceXrp} XRP` : '...'}
        </p>
        <p className="text-xs text-senior-muted mt-2 break-all font-mono">{address}</p>
      </section>

      <section className="bg-senior-bg/60 rounded-2xl p-5 border border-senior-line">
        {!signers ? (
          <p className="text-senior-muted text-sm">불러오는 중...</p>
        ) : signers.registered ? (
          <p className="text-senior-ink text-base leading-relaxed">
            <b className="text-senior-accentDeep">가족 가디언 {signers.signers?.length}명</b> 중{' '}
            <b className="text-senior-accentDeep">{signers.quorum}명</b>이 승인해야 송금이 진행됩니다.
            큰돈을 한 사람이 혼자 보낼 수 없도록 가족이 한 번 더 보는 구조예요.
          </p>
        ) : (
          <p className="text-senior-muted text-sm">아직 가족 가디언이 등록되어 있지 않습니다.</p>
        )}
      </section>

      <form
        onSubmit={onSubmit}
        className="bg-white rounded-2xl p-5 shadow-soft border border-senior-line space-y-4"
      >
        <div className="text-base font-extrabold text-senior-ink">송금하기</div>
        <label className="block">
          <span className="text-sm text-senior-muted">받는 분 주소 (예시 주소가 미리 채워져 있어요)</span>
          <input
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            className="mt-1.5 w-full font-mono text-sm rounded-xl border-2 border-senior-line px-4 py-3 focus:outline-none focus:border-senior-accent transition"
            placeholder="r..."
          />
        </label>
        <label className="block">
          <span className="text-sm text-senior-muted">보낼 금액 (XRP)</span>
          <input
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1.5 w-full text-2xl font-extrabold rounded-xl border-2 border-senior-line px-4 py-3 focus:outline-none focus:border-senior-accent transition text-senior-ink"
          />
        </label>
        <button
          type="submit"
          disabled={!canSubmit}
          className={clsx(
            'w-full py-4 rounded-2xl text-lg font-bold shadow-soft transition',
            canSubmit
              ? 'bg-senior-accent text-white hover:bg-senior-accentDeep'
              : 'bg-senior-accent text-white opacity-50 cursor-not-allowed',
          )}
        >
          {submitting ? '요청 만드는 중...' : '가족에게 승인 요청 보내기'}
        </button>
        <p className="text-xs text-senior-muted text-center">
          이 버튼을 누르면 가족 가디언 화면에 카드가 즉시 도착해요.
        </p>
      </form>

      {latest && (
        <section className="bg-white rounded-2xl p-5 shadow-soft border border-senior-line space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-bold text-senior-ink">가장 최근 송금 요청</div>
            <span className={clsx('text-xs px-2.5 py-1 rounded-full font-bold', statusBadge(latest.status).cls)}>
              {statusBadge(latest.status).text}
            </span>
          </div>
          <div className="text-senior-ink">
            <b className="text-2xl">{latest.amountXrp} XRP</b>{' '}
            <span className="text-senior-muted text-sm">→ {latest.toAddress.slice(0, 14)}…</span>
          </div>
          <div className="text-sm text-senior-muted">
            가족 승인 진행: <b className="text-senior-ink">{latest.approvals.length}</b> /{' '}
            <b className="text-senior-ink">{latest.quorum}</b>
          </div>
          {latest.explorerUrl && (
            <a
              href={latest.explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="block text-sm text-senior-accentDeep underline break-all"
            >
              송금 결과 확인 (블록체인 보기) →
            </a>
          )}
          {latest.errorMessage && (
            <p className="text-sm text-senior-bad">{latest.errorMessage}</p>
          )}
        </section>
      )}
    </main>
  );
};
