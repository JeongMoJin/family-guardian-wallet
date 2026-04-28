import { interpolate, spring, type SpringConfig, useCurrentFrame, useVideoConfig } from 'remotion';

// 페이드 + 살짝 위로 떠오르는 진입 애니메이션
export const useEnter = (
  startFrame = 0,
  durationFrames = 18,
  config: Partial<SpringConfig> = { damping: 200, stiffness: 100, mass: 0.7 },
) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;
  const s = spring({
    frame: Math.max(0, local),
    fps,
    config,
    durationInFrames: durationFrames,
  });
  return {
    opacity: interpolate(s, [0, 1], [0, 1]),
    translateY: interpolate(s, [0, 1], [40, 0]),
  };
};

export const fadeOut = (frame: number, startFrame: number, durationFrames = 12) => {
  const local = frame - startFrame;
  if (local <= 0) return 1;
  return interpolate(local, [0, durationFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

export const easeProgress = (
  frame: number,
  startFrame: number,
  durationFrames: number,
) => {
  return interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};
