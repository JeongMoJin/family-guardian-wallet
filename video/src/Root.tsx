import { Composition } from 'remotion';
import { Demo, FPS, TOTAL_FRAMES, WIDTH, HEIGHT } from './Demo';

export const RemotionRoot = () => {
  return (
    <Composition
      id="Demo"
      component={Demo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
