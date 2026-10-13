import React from 'react';
import { Composition, staticFile } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { HeroAd } from './HeroAd';
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from './timing';

// Same families the site ships: Geist (variable) and JetBrains Mono.
loadFont({
  family: 'Geist Variable',
  url: staticFile('fonts/geist-latin-wght-normal.woff2'),
  weight: '100 900',
});
loadFont({ family: 'JetBrains Mono', url: staticFile('fonts/jetbrains-mono-latin-400-normal.woff2'), weight: '400' });
loadFont({ family: 'JetBrains Mono', url: staticFile('fonts/jetbrains-mono-latin-500-normal.woff2'), weight: '500' });

export const RemotionRoot: React.FC = () => (
  <>
    {/* One component, theme as a prop. The two IDs only exist so each variant
        has its own default for `npx remotion render`. */}
    <Composition
      id="HeroAd-dark"
      component={HeroAd}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{ theme: 'dark' as const }}
    />
    <Composition
      id="HeroAd-light"
      component={HeroAd}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{ theme: 'light' as const }}
    />
  </>
);
