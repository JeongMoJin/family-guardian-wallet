import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import React from 'react';
import { COLORS } from '../theme';
import { useEnter, easeProgress } from '../anim';

// 단계 시작 프레임
const T_INPUT_ADDR = 90;
const T_INPUT_AMOUNT = 200;
const T_PRESS_SUBMIT = 290;
const T_CARD_ARRIVES = 360;
const T_G1_PRESS = 540;
const T_G1_DONE = T_G1_PRESS + 60;
const T_G2_PRESS = 780;
const T_G2_DONE = T_G2_PRESS + 60;
const T_COMBINING = 870;
const T_SUBMITTING = 950;
const T_SUCCESS = 1100;

const TARGET_ADDRESS = 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe';
const SENIOR_ADDRESS = 'rn3XdGVPxYboVZkdWzySGfi5K1LC2ym9gi';
const EXPLORER = 'https://testnet.xrpl.org/transactions/';

const typed = (full: string, frame: number, start: number, perCharFrames = 2) => {
  const visible = Math.max(0, Math.min(full.length, Math.floor((frame - start) / perCharFrames)));
  return full.slice(0, visible);
};

const Header = ({ title, sub }: { title: string; sub?: string }) => (
  <div
    style={{
      padding: '18px 24px',
      borderBottom: `2px solid ${COLORS.line}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.ink }}>{title}</div>
    {sub && <div style={{ fontSize: 16, color: COLORS.muted }}>{sub}</div>}
  </div>
);

const Panel: React.FC<{ children: React.ReactNode; title: string; sub?: string }> = ({
  children,
  title,
  sub,
}) => (
  <div
    style={{
      background: COLORS.card,
      border: `2px solid ${COLORS.line}`,
      borderRadius: 24,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      boxShadow: COLORS.shadow,
      backdropFilter: 'blur(8px)',
    }}
  >
    <Header title={title} sub={sub} />
    <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</div>
  </div>
);

const SeniorPanel = () => {
  const frame = useCurrentFrame();
  const balance = '100.00';

  const addressShown = typed(TARGET_ADDRESS, frame, T_INPUT_ADDR, 3);
  const amountShown = typed('50', frame, T_INPUT_AMOUNT, 12);

  const pressGlow = interpolate(
    frame,
    [T_PRESS_SUBMIT, T_PRESS_SUBMIT + 30, T_PRESS_SUBMIT + 60],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const pressed = frame >= T_PRESS_SUBMIT + 40;

  const showRequest = frame >= T_CARD_ARRIVES;
  const approvals = frame >= T_G2_DONE ? 2 : frame >= T_G1_DONE ? 1 : 0;

  const showResult = frame >= T_SUCCESS;
  const resultEnter = useEnter(T_SUCCESS, 30);

  return (
    <Panel title="시니어 화면" sub="XRPL testnet">
      <div style={{ fontSize: 18, color: COLORS.muted }}>내 잔액</div>
      <div style={{ fontSize: 56, fontWeight: 900, color: COLORS.ink, marginTop: 4 }}>
        {balance} XRP
      </div>
      <div style={{ fontSize: 14, color: COLORS.muted, fontFamily: 'monospace', marginTop: 6 }}>
        {SENIOR_ADDRESS}
      </div>

      <div style={{ marginTop: 20, fontSize: 18, fontWeight: 700, color: COLORS.ink }}>송금하기</div>
      <div
        style={{
          marginTop: 8,
          background: COLORS.cardSolid,
          border: `2px solid ${COLORS.line}`,
          borderRadius: 14,
          padding: '12px 16px',
          fontSize: 16,
          color: COLORS.ink,
          fontFamily: 'monospace',
          minHeight: 28,
        }}
      >
        {addressShown}
        {addressShown.length < TARGET_ADDRESS.length && (
          <span style={{ color: COLORS.accent }}>|</span>
        )}
      </div>
      <div
        style={{
          marginTop: 10,
          background: COLORS.cardSolid,
          border: `2px solid ${COLORS.line}`,
          borderRadius: 14,
          padding: '12px 16px',
          fontSize: 32,
          fontWeight: 800,
          color: COLORS.ink,
        }}
      >
        {amountShown || ' '} {amountShown && 'XRP'}
      </div>
      <div
        style={{
          marginTop: 14,
          padding: '16px 18px',
          borderRadius: 16,
          textAlign: 'center',
          fontWeight: 800,
          color: '#fff',
          fontSize: 20,
          background: COLORS.accent,
          opacity: pressed ? 0.6 : 1,
          boxShadow: `0 0 ${interpolate(pressGlow, [0, 1], [0, 40])}px ${COLORS.accent}`,
          transform: `scale(${interpolate(pressGlow, [0, 1], [1, 1.04])})`,
        }}
      >
        가족에게 승인 요청 보내기
      </div>

      {showRequest && (
        <div
          style={{
            marginTop: 16,
            background: COLORS.card,
            border: `2px solid ${COLORS.line}`,
            borderRadius: 16,
            padding: 16,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink }}>
            가족 승인 대기 중 · {approvals} / 2
          </div>
          <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>
            {amountShown} XRP → r{TARGET_ADDRESS.slice(1, 14)}...
          </div>
        </div>
      )}

      {showResult && (
        <div
          style={{
            marginTop: 'auto',
            opacity: resultEnter.opacity,
            transform: `translateY(${resultEnter.translateY}px)`,
            background: COLORS.goodBg,
            border: `2px solid ${COLORS.good}`,
            borderRadius: 18,
            padding: 18,
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.good }}>송금 완료</div>
          <div style={{ fontSize: 13, color: COLORS.ink, marginTop: 6, wordBreak: 'break-all' }}>
            {EXPLORER}D449E423...69BCAB
          </div>
        </div>
      )}
    </Panel>
  );
};

const GuardianPanel = ({ index }: { index: 1 | 2 }) => {
  const frame = useCurrentFrame();
  const myPress = index === 1 ? T_G1_PRESS : T_G2_PRESS;
  const myDone = index === 1 ? T_G1_DONE : T_G2_DONE;

  const showCard = frame >= T_CARD_ARRIVES;
  const enterAnim = useEnter(T_CARD_ARRIVES, 30);

  const pressGlow = interpolate(frame, [myPress, myPress + 30, myPress + 60], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const signedByMe = frame >= myDone;

  const otherDone = index === 1 ? false : frame >= T_G1_DONE;
  const approvalsHere = (signedByMe ? 1 : 0) + (otherDone ? 1 : 0);

  const submitted = frame >= T_SUCCESS;

  return (
    <Panel title={`가족 가디언 ${index}`} sub="가디언월렛 — 가족 승인">
      {!showCard ? (
        <div style={{ color: COLORS.muted, fontSize: 18, margin: 'auto' }}>
          대기 중인 송금 요청이 없습니다.
        </div>
      ) : (
        <div
          style={{
            opacity: enterAnim.opacity,
            transform: `translateY(${enterAnim.translateY}px)`,
            background: COLORS.card,
            border: `2px solid ${submitted ? COLORS.good : COLORS.line}`,
            borderRadius: 18,
            padding: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div
            style={{
              alignSelf: 'flex-start',
              fontSize: 12,
              padding: '4px 10px',
              borderRadius: 999,
              background: submitted ? COLORS.goodBg : COLORS.warnBg,
              color: submitted ? COLORS.good : COLORS.warn,
              fontWeight: 800,
            }}
          >
            {submitted ? '송금 완료' : '서명 수집 중'}
          </div>
          <div style={{ fontSize: 14, color: COLORS.muted }}>받는 분</div>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 13,
              color: COLORS.ink,
              wordBreak: 'break-all',
            }}
          >
            {TARGET_ADDRESS}
          </div>
          <div style={{ fontSize: 14, color: COLORS.muted, marginTop: 4 }}>금액</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: COLORS.ink }}>50 XRP</div>
          <div style={{ fontSize: 14, color: COLORS.muted, marginTop: 6 }}>
            현재 승인 <b>{approvalsHere}</b> / <b>2</b>
          </div>

          <div
            style={{
              marginTop: 8,
              padding: '12px 16px',
              borderRadius: 14,
              textAlign: 'center',
              fontWeight: 800,
              fontSize: 18,
              color: '#fff',
              background: signedByMe ? COLORS.good : COLORS.accent,
              boxShadow: `0 0 ${interpolate(pressGlow, [0, 1], [0, 40])}px ${COLORS.accent}`,
              transform: `scale(${interpolate(pressGlow, [0, 1], [1, 1.04])})`,
            }}
          >
            {signedByMe ? '✓ 승인 완료' : '이 송금을 승인합니다'}
          </div>
        </div>
      )}
    </Panel>
  );
};

const stageText = (frame: number): string => {
  if (frame < T_INPUT_ADDR) return '시연 모드 — 한 화면 분할';
  if (frame < T_PRESS_SUBMIT) return '시니어가 송금 요청을 작성합니다';
  if (frame < T_CARD_ARRIVES) return '서버: 멀티시그 트랜잭션 골격 autofill';
  if (frame < T_G1_PRESS) return '가디언 화면에 승인 요청 카드가 도착합니다';
  if (frame < T_G2_PRESS) return '가디언 1 partial 서명 추가';
  if (frame < T_COMBINING) return '가디언 2 partial 서명 추가 → quorum 충족';
  if (frame < T_SUBMITTING) return '서버: multisign 으로 두 partial 결합';
  if (frame < T_SUCCESS) return 'XRPL testnet · submitAndWait';
  return 'tesSUCCESS — testnet explorer 링크 노출';
};

const StageBanner = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        top: 24,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 700,
        color: COLORS.muted,
      }}
    >
      <span
        style={{
          background: COLORS.cardSolid,
          border: `2px solid ${COLORS.line}`,
          padding: '10px 22px',
          borderRadius: 999,
          boxShadow: COLORS.shadow,
        }}
      >
        {stageText(frame)}
      </span>
    </div>
  );
};

const Loader = () => {
  const frame = useCurrentFrame();
  if (frame < T_COMBINING || frame >= T_SUCCESS) return null;
  const progress = easeProgress(frame, T_COMBINING, T_SUCCESS - T_COMBINING);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        background: COLORS.cardSolid,
        border: `2px solid ${COLORS.accent}`,
        borderRadius: 999,
        padding: '12px 24px',
        fontSize: 18,
        color: COLORS.ink,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: COLORS.shadow,
      }}
    >
      <div
        style={{
          width: 220,
          height: 8,
          background: COLORS.line,
          borderRadius: 999,
          overflow: 'hidden',
        }}
      >
        <div style={{ width: `${progress * 100}%`, height: '100%', background: COLORS.accent }} />
      </div>
      <span>{frame < T_SUBMITTING ? 'multisign 결합 중...' : 'XRPL testnet 제출 중...'}</span>
    </div>
  );
};

export const DemoFlow = () => {
  return (
    <AbsoluteFill style={{ padding: '88px 56px 56px' }}>
      <StageBanner />
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 24,
          paddingTop: 16,
        }}
      >
        <SeniorPanel />
        <GuardianPanel index={1} />
        <GuardianPanel index={2} />
      </div>
      <Loader />
    </AbsoluteFill>
  );
};
