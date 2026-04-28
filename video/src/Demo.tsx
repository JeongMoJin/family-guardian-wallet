import { AbsoluteFill, Sequence } from 'remotion';
import { loadFont } from '@remotion/google-fonts/NotoSansKR';
import { COLORS } from './theme';
import { Title } from './scenes/Title';
import { Problem } from './scenes/Problem';
import { Solution } from './scenes/Solution';
import { DemoFlow } from './scenes/DemoFlow';
import { Differentiator } from './scenes/Differentiator';
import { CTA } from './scenes/CTA';

const { fontFamily } = loadFont('normal', { weights: ['400', '600', '700', '900'] });

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

const SCENES = [
  { name: 'title', frames: 90 },
  { name: 'problem', frames: 510 },
  { name: 'solution', frames: 360 },
  { name: 'demoFlow', frames: 1380 },
  { name: 'differentiator', frames: 360 },
  { name: 'cta', frames: 450 },
] as const;

export const TOTAL_FRAMES = SCENES.reduce((s, x) => s + x.frames, 0);

const offsets = SCENES.reduce<Record<string, number>>((acc, s, i) => {
  acc[s.name] = i === 0 ? 0 : acc[SCENES[i - 1].name] + SCENES[i - 1].frames;
  return acc;
}, {});

export const Demo = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        color: COLORS.ink,
        fontFamily,
        fontFeatureSettings: '"ss01"',
      }}
    >
      <Sequence from={offsets.title} durationInFrames={SCENES[0].frames}>
        <Title />
      </Sequence>
      <Sequence from={offsets.problem} durationInFrames={SCENES[1].frames}>
        <Problem />
      </Sequence>
      <Sequence from={offsets.solution} durationInFrames={SCENES[2].frames}>
        <Solution />
      </Sequence>
      <Sequence from={offsets.demoFlow} durationInFrames={SCENES[3].frames}>
        <DemoFlow />
      </Sequence>
      <Sequence from={offsets.differentiator} durationInFrames={SCENES[4].frames}>
        <Differentiator />
      </Sequence>
      <Sequence from={offsets.cta} durationInFrames={SCENES[5].frames}>
        <CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
