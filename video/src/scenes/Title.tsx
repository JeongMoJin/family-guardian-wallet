import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLORS, TYPO } from '../theme';
import { useEnter } from '../anim';

export const Title = () => {
  const frame = useCurrentFrame();
  const a = useEnter(0, 24);
  const b = useEnter(10, 24);
  const c = useEnter(22, 30);

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 80,
      }}
    >
      <div
        style={{
          opacity: a.opacity,
          transform: `translateY(${a.translateY}px)`,
          fontSize: 28,
          letterSpacing: 4,
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
          marginTop: 24,
          color: COLORS.ink,
        }}
      >
        가디언월렛
      </div>
      <div
        style={{
          opacity: c.opacity,
          transform: `translateY(${c.translateY}px)`,
          fontSize: 36,
          marginTop: 28,
          color: COLORS.muted,
          maxWidth: 1700,
          lineHeight: 1.45,
        }}
      >
        인지저하 시기 시니어의 자산을, 가족 2/3 승인이 있어야만 인출되는 XRPL 멀티시그 지갑
      </div>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 80,
          opacity: c.opacity * 0.7,
          fontSize: 22,
          color: COLORS.muted,
          letterSpacing: 6,
        }}
      >
        KFIP 2026 · {/* not user-facing dot but visual divider */} XRPL TESTNET
      </div>
      {/* prevent unused var */}
      <span style={{ display: 'none' }}>{frame}</span>
    </AbsoluteFill>
  );
};
