import { AbsoluteFill } from 'remotion';
import { COLORS, TYPO } from '../theme';
import { useEnter } from '../anim';

const cards = [
  {
    label: '왜 XRPL?',
    title: '네이티브 multisig',
    body: '별도 컨트랙트 없이 SignerListSet 한 줄로 가족 승인 구조 구현. 감사 리스크가 낮다.',
  },
  {
    label: '왜 시니어 적합?',
    title: '3 ~ 5초 정산 · 낮은 수수료',
    body: '큰 송금도, 매월 생활비도. 가족 다수 승인이 일상에 들어올 수 있는 속도와 비용.',
  },
  {
    label: '왜 확장 가능?',
    title: 'Escrow · RLUSD',
    body: '조건부 승계, 정기 송금, 스테이블코인 변동성 헷지까지 같은 계정 위에서 확장 가능.',
  },
];

export const Differentiator = () => {
  const head = useEnter(0, 24);

  return (
    <AbsoluteFill style={{ padding: 96, flexDirection: 'column', justifyContent: 'center' }}>
      <div
        style={{
          opacity: head.opacity,
          transform: `translateY(${head.translateY}px)`,
          fontSize: 24,
          letterSpacing: 6,
          color: COLORS.accentDeep,
          fontWeight: 700,
        }}
      >
        WHY XRPL
      </div>
      <div
        style={{
          opacity: head.opacity,
          transform: `translateY(${head.translateY}px)`,
          fontSize: TYPO.h1,
          fontWeight: 800,
          marginTop: 12,
          letterSpacing: -1,
          color: COLORS.ink,
        }}
      >
        후견 1인 권한 집중을, 가족 합의 + XRPL 로 풀었다
      </div>

      <div
        style={{
          marginTop: 56,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 28,
        }}
      >
        {cards.map((c, i) => {
          const a = useEnter(20 + i * 22, 24);
          return (
            <div
              key={c.title}
              style={{
                opacity: a.opacity,
                transform: `translateY(${a.translateY}px)`,
                background: COLORS.card,
                border: `2px solid ${COLORS.line}`,
                borderRadius: 28,
                padding: 36,
                minHeight: 380,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: COLORS.shadow,
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  letterSpacing: 4,
                  color: COLORS.accentDeep,
                  fontWeight: 700,
                }}
              >
                {c.label}
              </div>
              <div
                style={{
                  fontSize: TYPO.h2,
                  fontWeight: 800,
                  marginTop: 12,
                  color: COLORS.ink,
                  lineHeight: 1.15,
                }}
              >
                {c.title}
              </div>
              <div
                style={{
                  fontSize: TYPO.body,
                  color: COLORS.inkSoft,
                  marginTop: 18,
                  lineHeight: 1.5,
                }}
              >
                {c.body}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
