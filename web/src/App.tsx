import { useEffect, useMemo, useState } from 'react';
import { fetchConfig, type AppConfig } from './lib/api';
import { Home } from './views/Home';
import { SeniorView } from './views/SeniorView';
import { GuardianView } from './views/GuardianView';
import { DemoView } from './views/DemoView';
import { Header } from './components/Header';

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

const FullPage = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex items-center justify-center p-6">
    <div className="bg-white rounded-3xl p-8 max-w-md border-2 border-senior-line shadow-soft text-center">
      {children}
    </div>
  </div>
);

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
      <FullPage>
        <div className="text-xl font-extrabold text-senior-ink mb-2">
          서버에 연결할 수 없어요
        </div>
        <p className="text-sm text-senior-muted">{error}</p>
      </FullPage>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center text-senior-muted">
        불러오는 중...
      </div>
    );
  }

  if (!config.seniorAddress) {
    return (
      <FullPage>
        <div className="text-xl font-extrabold text-senior-ink mb-2">
          시니어 계정이 등록되지 않았어요
        </div>
        <p className="text-sm text-senior-muted">서버 환경변수를 확인해 주세요.</p>
      </FullPage>
    );
  }

  if (route.kind === 'senior') {
    return (
      <div className="min-h-screen">
        <Header subtitle="시니어 화면" />
        <SeniorView address={config.seniorAddress} defaultDestination={config.demoDestination} />
      </div>
    );
  }
  if (route.kind === 'guardian') {
    const g = config.guardians[route.index];
    if (!g) {
      return (
        <FullPage>
          <div className="text-xl font-extrabold text-senior-ink mb-2">
            해당 가디언이 등록되어 있지 않아요
          </div>
          <a href="/" className="text-senior-accent underline">
            홈으로 돌아가기
          </a>
        </FullPage>
      );
    }
    return (
      <div className="min-h-screen">
        <Header subtitle={`${g.label} 화면`} />
        <GuardianView guardian={g} />
      </div>
    );
  }
  if (route.kind === 'demo') return <DemoView config={config} />;

  return <Home config={config} />;
};

export default App;
