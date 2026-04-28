import { AbsoluteFill, Img, staticFile } from 'remotion';
import { COLORS, TYPO } from '../theme';
import { useEnter } from '../anim';

export const CTA = () => {
  const hero = useEnter(0, 30);
  const a = useEnter(15, 24);
  const b = useEnter(35, 24);
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
          opacity: hero.opacity,
          transform: `translateY(${hero.translateY}px)`,
          marginBottom: 36,
        }}
      >
        <Img
          src={staticFile('hero.png')}
          style={{
            width: 520,
            height: 'auto',
            filter: 'drop-shadow(0 16px 36px rgba(124, 90, 160, 0.18))',
          }}
        />
      </div>
      <div
        style={{
          opacity: a.opacity,
          transform: `translateY(${a.translateY}px)`,
          fontSize: 22,
          letterSpacing: 6,
          color: COLORS.accentDeep,
          fontWeight: 700,
        }}
      >
        FAMILY GUARDIAN WALLET
      </div>
      <div
        style={{
          opacity: b.opacity,
          transform: `translateY(${b.translateY}px)`,
          fontSize: TYPO.h1,
          fontWeight: 900,
          letterSpacing: -2,
          marginTop: 12,
          color: COLORS.ink,
        }}
      >
        큰돈 보낼 때, 가족이 한 번 더 본다
      </div>
      <div
        style={{
          opacity: c.opacity,
          transform: `translateY(${c.translateY}px)`,
          fontSize: 30,
          color: COLORS.inkSoft,
          marginTop: 22,
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
          marginTop: 36,
          background: COLORS.cardSolid,
          border: `2px solid ${COLORS.line}`,
          borderRadius: 999,
          padding: '18px 36px',
          fontSize: 30,
          fontWeight: 700,
          color: COLORS.ink,
          fontFamily: 'monospace',
          boxShadow: COLORS.shadow,
        }}
      >
        github.com / JeongMoJin / family-guardian-wallet
      </div>
      <div
        style={{
          opacity: d.opacity * 0.85,
          marginTop: 22,
          fontSize: 20,
          color: COLORS.muted,
          letterSpacing: 6,
        }}
      >
        KFIP 2026 · Korea Financial Innovation Program
      </div>
    </AbsoluteFill>
  );
};
