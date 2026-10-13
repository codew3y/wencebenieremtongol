import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Cta, Intro, Positioning, Projects, Stack } from './scenes';
import { THEMES, ThemeName } from './theme';
import { SCENES } from './timing';

export type HeroAdProps = { theme: ThemeName };

export const HeroAd: React.FC<HeroAdProps> = ({ theme }) => {
  const t = THEMES[theme];
  return (
    <AbsoluteFill style={{ background: t.bg }}>
      <Sequence from={SCENES.intro.from} durationInFrames={SCENES.intro.duration} name="1 Intro">
        <Intro t={t} />
      </Sequence>
      <Sequence from={SCENES.positioning.from} durationInFrames={SCENES.positioning.duration} name="2 Positioning">
        <Positioning t={t} />
      </Sequence>
      <Sequence from={SCENES.stack.from} durationInFrames={SCENES.stack.duration} name="3 Stack">
        <Stack t={t} />
      </Sequence>
      <Sequence from={SCENES.projects.from} durationInFrames={SCENES.projects.duration} name="4 Projects">
        <Projects t={t} />
      </Sequence>
      <Sequence from={SCENES.cta.from} durationInFrames={SCENES.cta.duration} name="5 CTA">
        <Cta t={t} />
      </Sequence>
    </AbsoluteFill>
  );
};
