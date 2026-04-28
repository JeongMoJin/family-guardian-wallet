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
  s === 'submitted' ? '송금 완료' : s === 'failed' ? '실패' : '가족 승인 기다리는 중';

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
    <main className={clsx(compact ? 'p-5 space-y-5' : 'max-w-3xl mx-auto px-6 py-10 space-y-7')}>
      {compact && (
        <div className="text-sm text-senior-muted">
          내 역할: <b className="text-senior-accentDeep">{guardian.label}</b>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-senior-bad/30 bg-senior-warnSoft px-5 py-4 text-senior-bad text-sm">
          {error}
        </div>
      )}

      <section>
        <div className="text-base font-extrabold text-senior-ink mb-3">승인 요청</div>
        {pending.length === 0 ? (
          <div className="bg-white/70 rounded-2xl p-6 border-2 border-dashed border-senior-line text-center">
            <div className="text-senior-muted">아직 대기 중인 송금 요청이 없어요.</div>
            <div className="text-xs text-senior-muted mt-2">
              시니어가 송금을 시도하면 카드가 자동으로 여기에 도착합니다.
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {pending.map((r) => {
              const alreadySigned = r.approvals.some((a) => a.guardianAddress === guardian.address);
              return (
                <li
                  key={r.id}
                  className="bg-white rounded-2xl p-5 shadow-soft border-2 border-senior-line"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-senior-muted text-xs">보내는 사람</div>
                      <div className="font-mono text-xs break-all text-senior-ink">{r.fromAddress}</div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-senior-accent/15 text-senior-accentDeep font-bold shrink-0">
                      대기 중
                    </span>
                  </div>

                  <div className="mt-3 space-y-1">
                    <div className="text-senior-muted text-xs">받는 사람</div>
                    <div className="font-mono text-xs break-all text-senior-ink">{r.toAddress}</div>
                  </div>

                  <div className="mt-4">
                    <div className="text-senior-muted text-xs">송금 금액</div>
                    <div className="text-3xl font-black text-senior-ink">{r.amountXrp} XRP</div>
                  </div>

                  <div className="mt-3 text-sm text-senior-muted">
                    현재 승인: <b className="text-senior-ink">{r.approvals.length}</b> /{' '}
                    <b className="text-senior-ink">{r.quorum}</b>
                  </div>

                  <button
                    type="button"
                    onClick={() => onApprove(r.id)}
                    disabled={alreadySigned || busyId === r.id}
                    className={clsx(
                      'mt-4 w-full py-4 rounded-2xl text-lg font-bold shadow-soft transition',
                      alreadySigned
                        ? 'bg-senior-goodSoft text-senior-good cursor-default'
                        : 'bg-senior-accent text-white hover:bg-senior-accentDeep',
                      busyId === r.id && 'opacity-60 cursor-wait',
                    )}
                  >
                    {alreadySigned
                      ? '이미 승인했어요'
                      : busyId === r.id
                        ? '승인 처리 중...'
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
          <div className="text-sm font-bold text-senior-inkSoft mb-2">최근 처리된 요청</div>
          <ul className="space-y-2">
            {recent.map((r) => (
              <li key={r.id} className="bg-white/80 rounded-xl p-4 border border-senior-line text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-senior-ink">
                    {r.amountXrp} XRP → {r.toAddress.slice(0, 14)}…
                  </span>
                  <span
                    className={clsx(
                      'text-xs px-2 py-1 rounded-full font-bold',
                      r.status === 'submitted'
                        ? 'bg-senior-goodSoft text-senior-good'
                        : 'bg-senior-warnSoft text-senior-warn',
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
                    className="block mt-2 text-senior-accentDeep underline break-all text-xs"
                  >
                    송금 결과 확인 →
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
};
