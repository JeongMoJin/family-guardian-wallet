import { AbsoluteFill } from 'remotion';
import { COLORS, TYPO } from '../theme';
import { useEnter } from '../anim';

const items = [
  { headline: '한국, 2025년 초고령사회 진입', body: '65세 이상이 전체 인구의 20%를 넘어선 첫 해' },
  {
    headline: '인지저하 초기 ~ 후견 개시 사이 “회색 지대”',
    body: '본인 의사결정 능력은 약해지지만 법적 보호는 아직 없는 구간',
  },
  {
    headline: '보이스피싱 · 자산 탈취 · 가족 분쟁 위험 집중',
    body: '큰돈 한 번이 노후 전체를 흔든다',
  },
  {
    headline: '본인인증 · OTP 만으로는 부족',
    body: '약해진 의사결정을 현재 금융 시스템은 보호하지 못함',
  },
];

export const Problem = () => {
  const titleAnim = useEnter(0, 24);
  return (
    <AbsoluteFill style={{ padding: 96, flexDirection: 'column', justifyContent: 'center' }}>
      <div
        style={{
          opacity: titleAnim.opacity,
          transform: `translateY(${titleAnim.translateY}px)`,
          fontSize: 28,
          letterSpacing: 6,
          color: COLORS.accent,
          fontWeight: 700,
        }}
      >
        PROBLEM
      </div>
      <div
        style={{
          opacity: titleAnim.opacity,
          transform: `translateY(${titleAnim.translateY}px)`,
          fontSize: TYPO.h1,
          fontWeight: 800,
          marginTop: 12,
          color: COLORS.ink,
          letterSpacing: -1,
        }}
      >
        지금의 금융은 시니어를 못 지킨다
      </div>

      <div style={{ marginTop: 64, display: 'grid', gap: 24 }}>
        {items.map((it, i) => {
          const a = useEnter(40 + i * 90, 24);
          return (
            <div
              key={it.headline}
              style={{
                opacity: a.opacity,
                transform: `translateY(${a.translateY}px)`,
                background: COLORS.card,
                borderRadius: 24,
                padding: '28px 36px',
                border: `2px solid ${COLORS.line}`,
                boxShadow: '0 4px 18px rgba(31,41,55,0.04)',
              }}
            >
              <div style={{ fontSize: TYPO.h3, fontWeight: 800, color: COLORS.ink }}>
                {it.headline}
              </div>
              <div style={{ fontSize: TYPO.body, color: COLORS.muted, marginTop: 8 }}>
                {it.body}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
