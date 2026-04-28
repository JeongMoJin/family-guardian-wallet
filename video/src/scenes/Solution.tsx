import { AbsoluteFill } from 'remotion';
import { COLORS, TYPO } from '../theme';
import { useEnter } from '../anim';

export const Solution = () => {
  const head = useEnter(0, 24);
  const stmt = useEnter(15, 30);
  const senior = useEnter(60, 24);
  const g1 = useEnter(90, 22);
  const g2 = useEnter(110, 22);
  const g3 = useEnter(130, 22);
  const note = useEnter(170, 24);

  const dotStyle = (good: boolean): React.CSSProperties => ({
    width: 24,
    height: 24,
    borderRadius: 999,
    background: good ? COLORS.good : '#E5E7EB',
    marginRight: 12,
  });

  return (
    <AbsoluteFill style={{ padding: 96, flexDirection: 'column', justifyContent: 'center' }}>
      <div
        style={{
          opacity: head.opacity,
          transform: `translateY(${head.translateY}px)`,
          fontSize: 28,
          letterSpacing: 6,
          color: COLORS.accent,
          fontWeight: 700,
        }}
      >
        SOLUTION
      </div>
      <div
        style={{
          opacity: stmt.opacity,
          transform: `translateY(${stmt.translateY}px)`,
          fontSize: TYPO.h1,
          fontWeight: 800,
          marginTop: 12,
          letterSpacing: -1,
        }}
      >
        가족 <span style={{ color: COLORS.accent }}>2 / 3 승인</span>이 있어야 자산이 움직인다
      </div>

      <div
        style={{
          marginTop: 64,
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: 56,
          alignItems: 'center',
        }}
      >
        <div
          style={{
            background: COLORS.card,
            border: `2px solid ${COLORS.line}`,
            borderRadius: 28,
            padding: 36,
            opacity: senior.opacity,
            transform: `translateY(${senior.translateY}px)`,
          }}
        >
          <div style={{ fontSize: TYPO.small, color: COLORS.muted }}>시니어</div>
          <div style={{ fontSize: TYPO.h2, fontWeight: 800, marginTop: 8 }}>송금하기</div>
          <div style={{ fontSize: TYPO.h3, color: COLORS.muted, marginTop: 20 }}>50 XRP</div>
          <div style={{ fontSize: TYPO.small, color: COLORS.muted, marginTop: 8 }}>
            받는 분 → r9...
          </div>
        </div>

        <div style={{ display: 'grid', gap: 18 }}>
          {[
            { label: '가족 가디언 1', anim: g1, signed: true },
            { label: '가족 가디언 2', anim: g2, signed: true },
            { label: '가족 가디언 3', anim: g3, signed: false },
          ].map((g) => (
            <div
              key={g.label}
              style={{
                opacity: g.anim.opacity,
                transform: `translateY(${g.anim.translateY}px)`,
                background: COLORS.card,
                border: `2px solid ${g.signed ? COLORS.good : COLORS.line}`,
                borderRadius: 24,
                padding: '24px 28px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div style={dotStyle(g.signed)} />
              <div style={{ fontSize: TYPO.h3, fontWeight: 700 }}>{g.label}</div>
              <div
                style={{
                  marginLeft: 'auto',
                  fontSize: TYPO.body,
                  color: g.signed ? COLORS.good : COLORS.muted,
                  fontWeight: 700,
                }}
              >
                {g.signed ? '승인' : '대기'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: 56,
          fontSize: TYPO.body,
          color: COLORS.muted,
          opacity: note.opacity,
          transform: `translateY(${note.translateY}px)`,
        }}
      >
        XRPL 네이티브 SignerListSet · 별도 컨트랙트 없음 · 3 ~ 5 초 정산
      </div>
    </AbsoluteFill>
  );
};
