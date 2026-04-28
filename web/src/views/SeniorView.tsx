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
  if (s === 'submitted') return { text: '송금 완료', cls: 'bg-emerald-100 text-emerald-800' };
  if (s === 'failed') return { text: '실패', cls: 'bg-red-100 text-red-800' };
  return { text: '가족 승인 대기', cls: 'bg-amber-100 text-amber-800' };
};

export const SeniorView = ({ address, defaultDestination, compact = false }: Props) => {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [signers, setSigners] = useState<SignerListInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [toAddress, setToAddress] = useState(defaultDestination);
  const [amount, setAmount] = useState('50');
  const [submitting, setSubmitting] = useState(false);
  const [latest, setLatest] = useState<SigningRequestView | null>(null);
  const [recent, setRecent] = useState<SigningRequestView[]>([]);

  // 잔액·가디언 목록은 한 번 + 5초 주기 갱신
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

  // 본인 송금 요청 진행 상태 폴링
  useEffect(() => {
    let alive = true;
    const tick = () => {
      listSigningRequests()
        .then((all) => {
          if (!alive) return;
          const mine = all.filter((r) => r.fromAddress === address);
          setRecent(mine.slice(0, 3));
          if (latest) {
            const updated = mine.find((r) => r.id === latest.id);
            if (updated) setLatest(updated);
          }
        })
        .catch(() => {});
    };
    tick();
    const t = setInterval(tick, 1500);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [address, latest?.id]);

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
    <div className={clsx(!compact && 'min-h-screen bg-senior-bg')}>
      {!compact && (
        <header className="border-b border-senior-line bg-white">
          <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
            <h1 className="text-xl font-bold text-senior-ink">가디언월렛</h1>
            <span className="text-sm text-senior-muted">XRPL testnet</span>
          </div>
        </header>
      )}

      <main className={clsx(compact ? 'p-5 space-y-5' : 'max-w-3xl mx-auto px-6 py-10 space-y-8')}>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {error}
          </div>
        )}

        <section>
          <p className="text-senior-muted">내 잔액</p>
          <p className="text-4xl font-bold text-senior-ink mt-1">
            {account ? `${account.balanceXrp} XRP` : '...'}
          </p>
          <p className="text-sm text-senior-muted mt-2 break-all font-mono">{address}</p>
        </section>

        <section className="bg-senior-card rounded-2xl p-6 shadow-sm border border-senior-line">
          <h2 className="text-lg font-semibold text-senior-ink mb-3">큰 금액 송금 시 가족 승인</h2>
          {!signers ? (
            <p className="text-senior-muted">불러오는 중...</p>
          ) : signers.registered ? (
            <p className="text-senior-ink">
              내가 송금을 요청하면, 등록된 가족 <b>{signers.signers?.length}</b>명 중{' '}
              <b>{signers.quorum}</b>명이 승인해야 송금이 실행됩니다.
            </p>
          ) : (
            <p className="text-senior-muted">
              아직 가디언이 등록되어 있지 않습니다. 루트에서{' '}
              <code className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                npm run setup-signers
              </code>{' '}
              를 먼저 실행해 주세요.
            </p>
          )}
        </section>

        <form
          onSubmit={onSubmit}
          className="bg-white rounded-2xl p-6 shadow-sm border border-senior-line space-y-4"
        >
          <h2 className="text-lg font-semibold text-senior-ink">송금하기</h2>
          <label className="block">
            <span className="text-sm text-senior-muted">받는 분 주소</span>
            <input
              type="text"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              className="mt-1 w-full font-mono text-sm rounded-xl border border-senior-line px-4 py-3 focus:outline-none focus:ring-2 focus:ring-senior-accent/40"
              placeholder="r..."
            />
          </label>
          <label className="block">
            <span className="text-sm text-senior-muted">금액 (XRP)</span>
            <input
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full text-2xl font-semibold rounded-xl border border-senior-line px-4 py-3 focus:outline-none focus:ring-2 focus:ring-senior-accent/40"
            />
          </label>
          <button
            type="submit"
            disabled={!canSubmit}
            className={clsx(
              'w-full py-5 rounded-2xl text-lg font-semibold',
              canSubmit
                ? 'bg-senior-accent text-white hover:opacity-95'
                : 'bg-senior-accent text-white opacity-50 cursor-not-allowed',
            )}
          >
            {submitting ? '요청 만드는 중...' : '가족에게 승인 요청 보내기'}
          </button>
        </form>

        {latest && (
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-senior-line space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-senior-ink">최근 송금 요청</h3>
              <span
                className={clsx('text-xs px-2 py-1 rounded-full', statusBadge(latest.status).cls)}
              >
                {statusBadge(latest.status).text}
              </span>
            </div>
            <div className="text-senior-ink">
              <b>{latest.amountXrp} XRP</b> →{' '}
              <span className="font-mono text-sm break-all">{latest.toAddress}</span>
            </div>
            <div className="text-sm text-senior-muted">
              승인 진행: <b>{latest.approvals.length}</b> / <b>{latest.quorum}</b>
            </div>
            {latest.explorerUrl && (
              <a
                href={latest.explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-sm text-senior-accent underline break-all"
              >
                {latest.explorerUrl}
              </a>
            )}
            {latest.errorMessage && (
              <p className="text-sm text-red-700">{latest.errorMessage}</p>
            )}
          </section>
        )}

        {recent.length > 1 && (
          <section className="text-sm text-senior-muted">
            <p>이전 요청 {recent.length}건</p>
            <ul className="mt-2 space-y-1">
              {recent.slice(latest ? 1 : 0).map((r) => (
                <li key={r.id} className="font-mono">
                  [{statusBadge(r.status).text}] {r.amountXrp} XRP → {r.toAddress.slice(0, 12)}...
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
};
