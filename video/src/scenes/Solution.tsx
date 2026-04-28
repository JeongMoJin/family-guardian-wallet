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

  const guardianRow = (label: string, dotColor: string, signed: boolean, anim: ReturnType<typeof useEnter>) => (
    <div
      style={{
        opacity: anim.opacity,
        transform: `translateY(${anim.translateY}px)`,
        background: COLORS.card,
        border: `2px solid ${signed ? COLORS.good : COLORS.line}`,
        borderRadius: 24,
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: COLORS.shadow,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 999,
          background: signed ? COLORS.good : dotColor,
          marginRight: 16,
          opacity: signed ? 1 : 0.5,
        }}
      />
      <div style={{ fontSize: TYPO.h3, fontWeight: 700, color: COLORS.ink }}>{label}</div>
      <div
        style={{
          marginLeft: 'auto',
          fontSize: TYPO.body,
          color: signed ? COLORS.good : COLORS.muted,
          fontWeight: 700,
        }}
      >
        {signed ? '승인' : '대기'}
      </div>
    </div>
  );

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
          color: COLORS.ink,
        }}
      >
        가족 <span style={{ color: COLORS.accentDeep }}>2 / 3 승인</span>이 있어야 자산이 움직인다
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
            boxShadow: COLORS.shadow,
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                background: COLORS.senior,
              }}
            />
            <div style={{ fontSize: TYPO.small, color: COLORS.muted }}>시니어</div>
          </div>
          <div style={{ fontSize: TYPO.h2, fontWeight: 800, marginTop: 12, color: COLORS.ink }}>
            송금하기
          </div>
          <div style={{ fontSize: TYPO.h3, color: COLORS.muted, marginTop: 20 }}>50 XRP</div>
          <div style={{ fontSize: TYPO.small, color: COLORS.muted, marginTop: 8 }}>
            받는 분 → r9...
          </div>
        </div>

        <div style={{ display: 'grid', gap: 18 }}>
          {guardianRow('가족 가디언 1', COLORS.guardianA, true, g1)}
          {guardianRow('가족 가디언 2', COLORS.guardianB, true, g2)}
          {guardianRow('가족 가디언 3', COLORS.guardianA, false, g3)}
        </div>
      </div>

      <div
        style={{
          marginTop: 56,
          fontSize: TYPO.body,
          color: COLORS.inkSoft,
          opacity: note.opacity,
          transform: `translateY(${note.translateY}px)`,
        }}
      >
        XRPL 네이티브 SignerListSet · 별도 컨트랙트 없음 · 3 ~ 5 초 정산
      </div>
    </AbsoluteFill>
  );
};
