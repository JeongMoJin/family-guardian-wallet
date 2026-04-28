import type { AppConfig } from '../lib/api';

interface Props {
  config: AppConfig;
}

const steps = [
  {
    n: '1',
    title: '시니어가 송금을 시도',
    body: '큰 금액을 보내려고 하면 즉시 가족에게 승인 요청이 갑니다.',
  },
  {
    n: '2',
    title: '가족 가디언 2명이 승인',
    body: '등록된 가족 3명 중 2명이 “이 송금 OK” 를 누르면 송금이 진행됩니다.',
  },
  {
    n: '3',
    title: '진짜 블록체인 위에서 송금',
    body: 'XRPL 테스트 네트워크에 자동 제출되고, 송금 결과 링크가 시니어에게 보입니다.',
  },
];

export const Home = ({ config }: Props) => {
  return (
    <div className="min-h-screen">
      <header className="bg-white/70 backdrop-blur-md border-b border-senior-line">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-senior-accentSoft to-senior-accent shadow-soft" />
          <div className="text-lg font-extrabold text-senior-ink">가디언월렛</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-14">
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-sm text-senior-accentDeep font-bold tracking-[0.4em] mb-4">
              FAMILY GUARDIAN WALLET
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-senior-ink leading-tight tracking-tight">
              큰돈 보낼 때,
              <br />
              가족이 한 번 더 본다
            </h1>
            <p className="mt-5 text-lg text-senior-inkSoft leading-relaxed">
              인지저하 시기 시니어의 자산을, 가족 <b>2 / 3 승인</b> 이 있어야만 인출되는 XRPL 지갑.
              송금이 시도되면 가족에게 즉시 알림이 가고, 두 명이 승인해야 비로소 자산이 움직입니다.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="?demo=1"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-senior-accent text-white text-lg font-bold shadow-soft hover:bg-senior-accentDeep transition"
              >
                시연 한 번에 보기 →
              </a>
              <a
                href="?role=senior"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white text-senior-ink text-base font-semibold border-2 border-senior-line hover:border-senior-accent transition"
              >
                시니어 화면만 보기
              </a>
            </div>

            <p className="mt-4 text-sm text-senior-muted">
              실제 XRPL 테스트 네트워크 위에서 트랜잭션이 도는 진짜 데모입니다.
            </p>
          </div>

          <div className="flex justify-center">
            <img
              src="/hero.png"
              alt="시니어를 가족 가디언 두 명이 둘러싼 일러스트"
              className="w-full max-w-md drop-shadow-[0_24px_48px_rgba(124,90,160,0.18)]"
            />
          </div>
        </section>

        <section className="mt-20">
          <div className="text-sm text-senior-accentDeep font-bold tracking-[0.4em] mb-3">
            HOW IT WORKS
          </div>
          <h2 className="text-3xl font-black text-senior-ink mb-8">어떻게 동작하나요?</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {steps.map((s) => (
              <div
                key={s.n}
                className="bg-white/85 backdrop-blur-md rounded-3xl p-7 border-2 border-senior-line shadow-soft"
              >
                <div className="w-12 h-12 rounded-2xl bg-senior-accent text-white text-xl font-black flex items-center justify-center mb-4">
                  {s.n}
                </div>
                <div className="text-xl font-extrabold text-senior-ink leading-snug">
                  {s.title}
                </div>
                <div className="mt-3 text-base text-senior-inkSoft leading-relaxed">{s.body}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 grid md:grid-cols-2 gap-5">
          <div className="bg-white/85 backdrop-blur-md rounded-3xl p-7 border-2 border-senior-line">
            <div className="text-base font-bold text-senior-ink">화면별로 따로 보고 싶다면</div>
            <p className="text-sm text-senior-muted mt-2">
              시니어와 가족 가디언이 각각 어떤 화면을 보는지 따로 열어볼 수 있어요.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a
                href="?role=senior"
                className="rounded-xl border border-senior-line bg-white px-3 py-3 text-sm font-semibold text-senior-ink hover:border-senior-accent transition text-center"
              >
                시니어 화면
              </a>
              <a
                href="?role=guardian1"
                className="rounded-xl border border-senior-line bg-white px-3 py-3 text-sm font-semibold text-senior-ink hover:border-senior-accent transition text-center"
              >
                가족 가디언 1
              </a>
              <a
                href="?role=guardian2"
                className="rounded-xl border border-senior-line bg-white px-3 py-3 text-sm font-semibold text-senior-ink hover:border-senior-accent transition text-center"
              >
                가족 가디언 2
              </a>
              <a
                href="?role=guardian3"
                className="rounded-xl border border-senior-line bg-white px-3 py-3 text-sm font-semibold text-senior-ink hover:border-senior-accent transition text-center"
              >
                가족 가디언 3
              </a>
            </div>
          </div>

          <div className="bg-white/85 backdrop-blur-md rounded-3xl p-7 border-2 border-senior-line">
            <div className="text-base font-bold text-senior-ink">현재 시니어 계정</div>
            <p className="text-xs text-senior-muted mt-2 break-all font-mono">
              {config.seniorAddress}
            </p>
            <p className="text-sm text-senior-inkSoft mt-3">
              실제 XRPL 테스트 네트워크에서 살아 있는 계정입니다. 송금이 일어나면 testnet
              explorer 에서 직접 확인할 수 있어요.
            </p>
          </div>
        </section>

        <footer className="mt-20 text-center text-sm text-senior-muted">
          KFIP 2026 · 가디언월렛
        </footer>
      </main>
    </div>
  );
};
