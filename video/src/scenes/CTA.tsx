import { AbsoluteFill } from 'remotion';
import { COLORS, TYPO } from '../theme';
import { useEnter } from '../anim';

export const CTA = () => {
  const a = useEnter(0, 24);
  const b = useEnter(20, 24);
  const c = useEnter(60, 24);
  const d = useEnter(110, 28);

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 96,
      }}
    >
      <div
        style={{
          opacity: a.opacity,
          transform: `translateY(${a.translateY}px)`,
          fontSize: 28,
          letterSpacing: 6,
          color: COLORS.accent,
          fontWeight: 700,
        }}
      >
        FAMILY GUARDIAN WALLET
      </div>
      <div
        style={{
          opacity: b.opacity,
          transform: `translateY(${b.translateY}px)`,
          fontSize: TYPO.display,
          fontWeight: 900,
          letterSpacing: -2,
          marginTop: 18,
          color: COLORS.ink,
        }}
      >
        큰돈 보낼 때, 가족이 한 번 더 본다
      </div>
      <div
        style={{
          opacity: c.opacity,
          transform: `translateY(${c.translateY}px)`,
          fontSize: TYPO.h3,
          color: COLORS.muted,
          marginTop: 28,
          maxWidth: 1500,
          lineHeight: 1.45,
        }}
      >
        XRPL 네이티브 멀티시그 · 가족 2 / 3 승인 · 인지저하 시기 시니어 자산 보호
      </div>
      <div
        style={{
          opacity: d.opacity,
          transform: `translateY(${d.translateY}px)`,
          marginTop: 56,
          background: COLORS.card,
          border: `2px solid ${COLORS.line}`,
          borderRadius: 999,
          padding: '20px 40px',
          fontSize: TYPO.h3,
          fontWeight: 700,
          color: COLORS.ink,
          fontFamily: 'monospace',
        }}
      >
        github.com / JeongMoJin / family-guardian-wallet
      </div>
      <div
        style={{
          opacity: d.opacity * 0.8,
          marginTop: 28,
          fontSize: 22,
          color: COLORS.muted,
          letterSpacing: 6,
        }}
      >
        KFIP 2026 · Korea Financial Innovation Program
      </div>
    </AbsoluteFill>
  );
};
