import { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  approveSigningRequest,
  createSigningRequest,
  listSigningRequests,
  type AppConfig,
  type SigningRequestView,
} from '../lib/api';
import { SeniorView } from './SeniorView';
import { GuardianView } from './GuardianView';
import { Header } from '../components/Header';

const STEPS = [
  { n: 1, label: '시니어가 송금 시도' },
  { n: 2, label: '가족 가디언 1 승인' },
  { n: 3, label: '가족 가디언 2 승인' },
  { n: 4, label: '블록체인 자동 제출' },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface Props {
  config: AppConfig;
}

export const DemoView = ({ config }: Props) => {
  const [autoStep, setAutoStep] = useState(0); // 0=대기, 1~4=진행, 5=완료
  const [autoError, setAutoError] = useState<string | null>(null);
  const [latestId, setLatestId] = useState<string | null>(null);
  const [latest, setLatest] = useState<SigningRequestView | null>(null);

  // 진행 중 결과 폴링
  useEffect(() => {
    if (!latestId) return;
    const tick = () => {
      listSigningRequests()
        .then((all) => {
          const found = all.find((r) => r.id === latestId);
          if (found) setLatest(found);
        })
        .catch(() => {});
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [latestId]);

  const startAuto = async () => {
    setAutoError(null);
    setAutoStep(1);
    try {
      const created = await createSigningRequest({
        toAddress: config.demoDestination,
        amountXrp: '50',
      });
      setLatestId(created.id);
      await sleep(1800);

      const g1 = config.guardians[0];
      const g2 = config.guardians[1];
      if (!g1 || !g2) throw new Error('가족 가디언 두 명이 등록되어 있어야 해요.');

      setAutoStep(2);
      await approveSigningRequest(created.id, g1.address);
      await sleep(1800);

      setAutoStep(3);
      setAutoStep(4);
      await approveSigningRequest(created.id, g2.address);
      setAutoStep(5);
    } catch (err) {
      setAutoError(err instanceof Error ? err.message : '자동 시연 실패');
      setAutoStep(0);
    }
  };

  const reset = () => {
    setAutoStep(0);
    setAutoError(null);
    setLatestId(null);
    setLatest(null);
  };

  if (!config.seniorAddress) {
    return <div className="p-8 text-senior-muted">시니어 계정이 설정되지 않았습니다.</div>;
  }
  const g1 = config.guardians[0];
  const g2 = config.guardians[1];

  const running = autoStep > 0 && autoStep < 5;
  const finished = autoStep >= 5;

  return (
    <div className="min-h-screen">
      <Header subtitle="시연 모드 — 한 화면에서 전체 흐름 보기" />

      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 border-2 border-senior-line shadow-soft">
          <div className="flex flex-wrap items-start gap-5 justify-between">
            <div className="max-w-2xl">
              <div className="text-xs text-senior-accentDeep font-bold tracking-[0.3em]">
                LIVE DEMO
              </div>
              <div className="text-2xl md:text-3xl font-black text-senior-ink mt-1">
                자동 시연 한 번에 보기
              </div>
              <p className="text-sm text-senior-inkSoft mt-2 leading-relaxed">
                버튼을 누르면 시니어 → 가족 1 → 가족 2 → 블록체인 제출까지 4 단계가 자동으로
                진행돼요. 아래 세 화면이 동시에 변화합니다.
              </p>
            </div>
            <div className="flex gap-2">
              {!running && !finished && (
                <button
                  onClick={startAuto}
                  className="px-7 py-4 rounded-2xl bg-senior-accent text-white text-lg font-bold shadow-soft hover:bg-senior-accentDeep transition"
                >
                  자동 시연 시작 →
                </button>
              )}
              {(running || finished) && (
                <button
                  onClick={reset}
                  className="px-5 py-3 rounded-2xl bg-white text-senior-ink text-sm font-semibold border-2 border-senior-line hover:border-senior-accent transition"
                >
                  처음부터 다시
                </button>
              )}
            </div>
          </div>

          {/* 단계 표시기 */}
          <ol className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {STEPS.map((s) => {
              const active = autoStep === s.n && !finished;
              const done = autoStep > s.n || finished;
              const hl = active || done;
              return (
                <li
                  key={s.n}
                  className={clsx(
                    'rounded-2xl p-4 border-2 transition',
                    hl
                      ? 'bg-senior-accent/10 border-senior-accent'
                      : 'bg-white border-senior-line',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={clsx(
                        'w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm',
                        done
                          ? 'bg-senior-good text-white'
                          : active
                            ? 'bg-senior-accent text-white animate-pulse'
                            : 'bg-senior-line text-senior-muted',
                      )}
                    >
                      {done ? '✓' : s.n}
                    </div>
                    <div className="text-sm font-bold text-senior-ink">{s.label}</div>
                  </div>
                </li>
              );
            })}
          </ol>

          {autoError && (
            <div className="mt-4 px-4 py-3 rounded-xl bg-senior-warnSoft text-senior-warn text-sm">
              자동 시연 중 오류: {autoError}
            </div>
          )}

          {finished && latest?.status === 'submitted' && latest.explorerUrl && (
            <div className="mt-4 px-5 py-4 rounded-2xl bg-senior-goodSoft border-2 border-senior-good">
              <div className="text-senior-good font-extrabold text-base">
                ✓ 송금이 블록체인에 제출됐어요
              </div>
              <a
                href={latest.explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="block mt-2 text-sm text-senior-ink underline break-all"
              >
                {latest.explorerUrl}
              </a>
            </div>
          )}

          {finished && latest?.status === 'failed' && (
            <div className="mt-4 px-5 py-4 rounded-2xl bg-senior-warnSoft border-2 border-senior-warn">
              <div className="text-senior-warn font-extrabold">제출 실패</div>
              <div className="text-sm text-senior-ink mt-1">{latest.errorMessage}</div>
              <div className="text-xs text-senior-muted mt-2">
                테스트 계정 잔액이 부족할 수 있어요. 잠시 뒤 다시 시도해 주세요.
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl border-2 border-senior-line shadow-soft overflow-hidden">
          <div className="px-5 py-3 border-b border-senior-line bg-white/60 text-sm font-bold text-senior-ink">
            시니어 화면
          </div>
          <SeniorView
            address={config.seniorAddress}
            defaultDestination={config.demoDestination}
            compact
          />
        </div>
        {g1 && (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl border-2 border-senior-line shadow-soft overflow-hidden">
            <div className="px-5 py-3 border-b border-senior-line bg-white/60 text-sm font-bold text-senior-ink">
              {g1.label} 화면
            </div>
            <GuardianView guardian={g1} compact />
          </div>
        )}
        {g2 && (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl border-2 border-senior-line shadow-soft overflow-hidden">
            <div className="px-5 py-3 border-b border-senior-line bg-white/60 text-sm font-bold text-senior-ink">
              {g2.label} 화면
            </div>
            <GuardianView guardian={g2} compact />
          </div>
        )}
      </div>
    </div>
  );
};
