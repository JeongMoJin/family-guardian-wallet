import { useEffect, useMemo, useState } from 'react';
import { fetchConfig, type AppConfig } from './lib/api';
import { SeniorView } from './views/SeniorView';
import { GuardianView } from './views/GuardianView';
import { DemoView } from './views/DemoView';

type Route =
  | { kind: 'home' }
  | { kind: 'senior' }
  | { kind: 'guardian'; index: number }
  | { kind: 'demo' };

const parseRoute = (): Route => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('demo') === '1') return { kind: 'demo' };
  const role = params.get('role');
  if (role === 'senior') return { kind: 'senior' };
  if (role && role.startsWith('guardian')) {
    const idx = Number(role.replace('guardian', '')) - 1;
    if (Number.isFinite(idx) && idx >= 0) return { kind: 'guardian', index: idx };
  }
  return { kind: 'home' };
};

const Home = ({ config }: { config: AppConfig }) => {
  const links = [
    { href: '?role=senior', label: '시니어 화면' },
    ...config.guardians.map((g, i) => ({
      href: `?role=guardian${i + 1}`,
      label: `${g.label} 화면`,
    })),
    { href: '?demo=1', label: '시연 모드 (한 화면 분할)' },
  ];
  return (
    <div className="min-h-screen bg-senior-bg">
      <header className="border-b border-senior-line bg-white">
        <div className="max-w-3xl mx-auto px-6 py-5">
          <h1 className="text-xl font-bold text-senior-ink">가디언월렛</h1>
          <p className="text-sm text-senior-muted">
            인지저하 시기 시니어의 자산을, 가족 2/3 승인이 있어야만 인출되는 XRPL 멀티시그 지갑.
          </p>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-10 space-y-4">
        <p className="text-senior-muted">시연용 화면을 선택하세요.</p>
        <ul className="space-y-2">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="block rounded-2xl border border-senior-line bg-white px-5 py-4 hover:bg-senior-card"
              >
                <div className="font-semibold text-senior-ink">{l.label}</div>
                <div className="text-sm text-senior-muted font-mono">{l.href}</div>
              </a>
            </li>
          ))}
        </ul>
        <div className="text-xs text-senior-muted pt-4">
          현재 시니어 주소: <span className="font-mono break-all">{config.seniorAddress}</span>
        </div>
      </main>
    </div>
  );
};

const App = () => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const route = useMemo(parseRoute, []);

  useEffect(() => {
    fetchConfig()
      .then(setConfig)
      .catch((e: Error) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-senior-ink mb-2">서버에 연결할 수 없습니다</h1>
        <p className="text-senior-muted">
          백엔드가 켜져 있는지 확인해 주세요. 루트에서 <code>npm run dev</code> 또는{' '}
          <code>npm run dev:server</code>.
        </p>
        <p className="text-sm text-red-600 mt-3">{error}</p>
      </div>
    );
  }

  if (!config) {
    return <div className="p-8 text-senior-muted">불러오는 중...</div>;
  }

  if (!config.seniorAddress) {
    return (
      <div className="p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-senior-ink mb-2">시니어 계정이 없습니다</h1>
        <p className="text-senior-muted">
          루트의 <code>.env</code> 에 <code>SENIOR_ADDRESS</code> 가 채워져 있는지 확인해 주세요.
          비어 있으면{' '}
          <code className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
            npm run create-accounts
          </code>{' '}
          로 testnet 계정을 먼저 생성해야 합니다.
        </p>
      </div>
    );
  }

  if (route.kind === 'senior') {
    return (
      <SeniorView
        address={config.seniorAddress}
        defaultDestination={config.demoDestination}
      />
    );
  }
  if (route.kind === 'guardian') {
    const g = config.guardians[route.index];
    if (!g) {
      return (
        <div className="p-8 text-senior-muted">
          해당 가디언이 등록되어 있지 않습니다. <a href="/" className="underline">홈으로</a>
        </div>
      );
    }
    return <GuardianView guardian={g} />;
  }
  if (route.kind === 'demo') return <DemoView config={config} />;

  return <Home config={config} />;
};

export default App;
