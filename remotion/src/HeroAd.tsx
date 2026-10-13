import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Blueprint, Identity, Product, Systems, Vista } from "./scenes";
import { THEMES, ThemeName, FONT_MONO, FONT_SANS } from "./theme";
import { SCENES } from "./timing";

export type HeroAdProps = { theme: ThemeName };
export const HeroAd: React.FC<HeroAdProps> = ({ theme }) => {
  const t = THEMES[theme];
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: t.bg,
        color: t.fg,
        fontFamily: FONT_SANS,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 920,
          height: 920,
          right: -170,
          top: -150,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${t.accentSoft}, transparent 68%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 116,
          right: 116,
          top: 64,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: FONT_MONO,
          fontSize: 24,
          letterSpacing: "0.06em",
          color: t.muted,
        }}
      >
        <span>
          <span style={{ color: t.accent }}>W/T</span>
        </span>
        <span>DESIGN → DEVELOP → CONNECT</span>
      </div>
      <Sequence
        {...{
          from: SCENES.intro.from,
          durationInFrames: SCENES.intro.duration,
        }}
        name="01 / Identity"
      >
        <Identity t={t} globalFrame={frame} />
      </Sequence>
      <Sequence
        from={SCENES.blueprint.from}
        durationInFrames={SCENES.blueprint.duration}
        name="02 / Idea to product"
      >
        <Blueprint t={t} />
      </Sequence>
      <Sequence
        from={SCENES.techselect.from}
        durationInFrames={SCENES.techselect.duration}
        name="03 / TechSelect"
      >
        <Product t={t} index={0} />
      </Sequence>
      <Sequence
        from={SCENES.barberhouse.from}
        durationInFrames={SCENES.barberhouse.duration}
        name="04 / BarberHouse"
      >
        <Product t={t} index={1} />
      </Sequence>
      <Sequence
        from={SCENES.systems.from}
        durationInFrames={SCENES.systems.duration}
        name="05 / Connected systems"
      >
        <Systems t={t} />
      </Sequence>
      <Sequence
        from={SCENES.vista.from}
        durationInFrames={SCENES.vista.duration}
        name="06 / VistaVR"
      >
        <Vista t={t} />
      </Sequence>
      <Sequence
        from={SCENES.outro.from}
        durationInFrames={SCENES.outro.duration}
        name="07 / Back to the beginning"
      >
        <Identity t={t} closing globalFrame={frame} />
      </Sequence>
      <div
        style={{
          position: "absolute",
          left: 116,
          right: 116,
          bottom: 24,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: FONT_MONO,
          fontSize: 22,
          color: t.muted,
        }}
      >
        <span>SELECTED WORK & EXPLORATIONS</span>
        <span>wencetongol.vercel.app ↗</span>
      </div>
    </AbsoluteFill>
  );
};
