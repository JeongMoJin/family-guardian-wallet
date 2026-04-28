import { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  approveSigningRequest,
  listSigningRequests,
  type GuardianConfig,
  type SigningRequestView,
} from '../lib/api';

interface Props {
  guardian: GuardianConfig;
  compact?: boolean;
}

const statusLabel = (s: SigningRequestView['status']) =>
  s === 'submitted' ? '송금 완료' : s === 'failed' ? '실패' : '서명 수집 중';

export const GuardianView = ({ guardian, compact = false }: Props) => {
  const [requests, setRequests] = useState<SigningRequestView[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const tick = () => {
      listSigningRequests()
        .then((all) => alive && setRequests(all))
        .catch((e: Error) => alive && setError(e.message));
    };
    tick();
    const t = setInterval(tick, 1500);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const onApprove = async (id: string) => {
    setError(null);
    setBusyId(id);
    try {
      const updated = await approveSigningRequest(id, guardian.address);
      setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    } catch (err) {
      setError(err instanceof Error ? err.message : '승인 실패');
    } finally {
      setBusyId(null);
    }
  };

  const pending = requests.filter((r) => r.status === 'pending');
  const recent = requests.filter((r) => r.status !== 'pending').slice(0, 3);

  return (
    <div className={clsx(!compact && 'min-h-screen bg-senior-bg')}>
      {!compact && (
        <header className="border-b border-senior-line bg-white">
          <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
            <h1 className="text-xl font-bold text-senior-ink">가디언월렛 — 가족 승인</h1>
            <span className="text-sm text-senior-muted">{guardian.label}</span>
          </div>
        </header>
      )}

      <main className={clsx(compact ? 'p-5 space-y-5' : 'max-w-3xl mx-auto px-6 py-10 space-y-8')}>
        {compact && (
          <div className="text-sm text-senior-muted">
            현재 화면: <b className="text-senior-ink">{guardian.label}</b>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {error}
          </div>
        )}

        <section>
          <h2 className="text-lg font-semibold text-senior-ink mb-3">승인 요청</h2>
          {pending.length === 0 ? (
            <p className="text-senior-muted">대기 중인 송금 요청이 없습니다.</p>
          ) : (
            <ul className="space-y-3">
              {pending.map((r) => {
                const alreadySigned = r.approvals.some(
                  (a) => a.guardianAddress === guardian.address,
                );
                return (
                  <li
                    key={r.id}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-senior-line"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="text-senior-muted text-sm">보내는 사람</div>
                        <div className="font-mono text-sm break-all">{r.fromAddress}</div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 shrink-0">
                        {statusLabel(r.status)}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1">
                      <div className="text-senior-muted text-sm">받는 사람</div>
                      <div className="font-mono text-sm break-all">{r.toAddress}</div>
                    </div>

                    <div className="mt-3">
                      <div className="text-senior-muted text-sm">금액</div>
                      <div className="text-3xl font-bold text-senior-ink">{r.amountXrp} XRP</div>
                    </div>

                    <div className="mt-3 text-sm text-senior-muted">
                      현재 승인 <b>{r.approvals.length}</b> / <b>{r.quorum}</b>
                    </div>

                    <button
                      type="button"
                      onClick={() => onApprove(r.id)}
                      disabled={alreadySigned || busyId === r.id}
                      className={clsx(
                        'mt-4 w-full py-4 rounded-2xl text-lg font-semibold',
                        alreadySigned
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : 'bg-senior-accent text-white hover:opacity-95',
                        busyId === r.id && 'opacity-60 cursor-wait',
                      )}
                    >
                      {alreadySigned
                        ? '이미 승인했습니다'
                        : busyId === r.id
                          ? '서명 중...'
                          : '이 송금을 승인합니다'}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {recent.length > 0 && (
          <section>
            <h3 className="font-semibold text-senior-ink mb-2 text-sm">최근 처리된 요청</h3>
            <ul className="space-y-2">
              {recent.map((r) => (
                <li
                  key={r.id}
                  className="bg-white rounded-xl p-4 border border-senior-line text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-senior-ink">
                      {r.amountXrp} XRP → {r.toAddress.slice(0, 14)}...
                    </span>
                    <span
                      className={clsx(
                        'text-xs px-2 py-1 rounded-full',
                        r.status === 'submitted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800',
                      )}
                    >
                      {statusLabel(r.status)}
                    </span>
                  </div>
                  {r.explorerUrl && (
                    <a
                      href={r.explorerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block mt-2 text-senior-accent underline break-all"
                    >
                      {r.explorerUrl}
                    </a>
                  )}
                  {r.errorMessage && (
                    <p className="mt-2 text-red-700 text-xs">{r.errorMessage}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
};
