import { AbsoluteFill, Img, staticFile } from 'remotion';
import { COLORS, TYPO } from '../theme';
import { useEnter } from '../anim';

export const Title = () => {
  const a = useEnter(0, 24);
  const b = useEnter(10, 24);
  const c = useEnter(22, 30);
  const hero = useEnter(6, 36);

  return (
    <AbsoluteFill
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 96px',
        gap: 48,
      }}
    >
      <div style={{ flex: 1, maxWidth: 900 }}>
        <div
          style={{
            opacity: a.opacity,
            transform: `translateY(${a.translateY}px)`,
            fontSize: 24,
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
            fontSize: TYPO.display,
            fontWeight: 900,
            letterSpacing: -2,
            marginTop: 20,
            color: COLORS.ink,
            lineHeight: 1.05,
          }}
        >
          가디언월렛
        </div>
        <div
          style={{
            opacity: c.opacity,
            transform: `translateY(${c.translateY}px)`,
            fontSize: 34,
            marginTop: 28,
            color: COLORS.inkSoft,
            lineHeight: 1.5,
          }}
        >
          인지저하 시기 시니어의 자산을,
          <br />
          가족 2 / 3 승인이 있어야만 인출되는
          <br />
          XRPL 멀티시그 지갑
        </div>
        <div
          style={{
            opacity: c.opacity * 0.85,
            marginTop: 36,
            fontSize: 20,
            color: COLORS.muted,
            letterSpacing: 4,
          }}
        >
          KFIP 2026 · XRPL TESTNET
        </div>
      </div>

      <div
        style={{
          flex: 1.05,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: hero.opacity,
          transform: `translateY(${hero.translateY}px) scale(${1 - 0.04 * (1 - hero.opacity)})`,
        }}
      >
        <Img
          src={staticFile('hero.png')}
          style={{
            width: '100%',
            maxWidth: 820,
            height: 'auto',
            filter: 'drop-shadow(0 24px 48px rgba(124, 90, 160, 0.18))',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
