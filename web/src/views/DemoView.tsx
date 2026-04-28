import type { AppConfig } from '../lib/api';
import { SeniorView } from './SeniorView';
import { GuardianView } from './GuardianView';

interface Props {
  config: AppConfig;
}

// 시연용 한 화면 분할: 시니어 + 가디언 2명을 동시에 보여준다.
// 심사위원이 송금 요청부터 가족 2/3 승인 → testnet 트랜잭션 제출까지 한 흐름으로 본다.
export const DemoView = ({ config }: Props) => {
  if (!config.seniorAddress) {
    return <div className="p-8 text-senior-muted">시니어 계정이 설정되지 않았습니다.</div>;
  }
  const g1 = config.guardians[0];
  const g2 = config.guardians[1];

  return (
    <div className="min-h-screen bg-senior-bg">
      <header className="border-b border-senior-line bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-senior-ink">가디언월렛 — 시연 모드</h1>
          <span className="text-sm text-senior-muted">
            XRPL testnet · 시니어 + 가족 가디언 2명 동시 화면
          </span>
        </div>
      </header>
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-senior-line">
          <div className="px-5 pt-4 pb-2 border-b border-senior-line text-sm font-semibold text-senior-ink">
            시니어 화면
          </div>
          <SeniorView
            address={config.seniorAddress}
            defaultDestination={config.demoDestination}
            compact
          />
        </div>

        {g1 && (
          <div className="bg-white rounded-2xl border border-senior-line">
            <div className="px-5 pt-4 pb-2 border-b border-senior-line text-sm font-semibold text-senior-ink">
              {g1.label} 화면
            </div>
            <GuardianView guardian={g1} compact />
          </div>
        )}

        {g2 && (
          <div className="bg-white rounded-2xl border border-senior-line">
            <div className="px-5 pt-4 pb-2 border-b border-senior-line text-sm font-semibold text-senior-ink">
              {g2.label} 화면
            </div>
            <GuardianView guardian={g2} compact />
          </div>
        )}
      </div>
    </div>
  );
};
