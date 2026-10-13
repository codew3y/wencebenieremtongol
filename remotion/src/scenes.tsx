import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from 'remotion';
import {
  PERSON,
  POSITIONING_LINES,
  POSITIONING_ACCENT,
  PROJECTS,
  Project,
  STACK_HEADING,
  STACK_SUB,
} from './content';
import { STACK_ICONS } from './icons';
import {
  BrowserFrame,
  Chip,
  EASE_IN_OUT,
  Eyebrow,
  Headline,
  PhoneFrame,
  SceneShell,
  ShotCycle,
  WordReveal,
  ease,
} from './primitives';
import { FONT_MONO, FONT_SANS, Tokens } from './theme';
import { PROJECT_DURATION, SCENES } from './timing';

const PAD_X = 180;

/* 1 · Intro, 0–5 s ---------------------------------------------------------- */
export const Intro: React.FC<{ t: Tokens }> = ({ t }) => {
  const frame = useCurrentFrame();
  const rule = ease(frame, 58, 30, 0, 1, EASE_IN_OUT);
  const loc = ease(frame, 72, 18);
  return (
    <SceneShell duration={SCENES.intro.duration}>
      <AbsoluteFill style={{ padding: `0 ${PAD_X}px`, justifyContent: 'center' }}>
        <Eyebrow text={PERSON.title} t={t} start={10} framesPerChar={2} size={26} />
        <WordReveal
          text={PERSON.name}
          start={30}
          stagger={5}
          style={{ ...Headline, fontSize: 184, color: t.fg, marginTop: 28 }}
        />
        <div
          style={{
            marginTop: 44,
            height: 1,
            width: 1200 * rule,
            background: t.lineStrong,
          }}
        />
        <div
          style={{
            marginTop: 28,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            opacity: loc,
            transform: `translateY(${(1 - loc) * 12}px)`,
            fontFamily: FONT_MONO,
            fontSize: 22,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: t.muted,
          }}
        >
          <div style={{ width: 10, height: 10, background: t.accent }} />
          {PERSON.location}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

/* 2 · Positioning, 5–9 s ---------------------------------------------------- */
export const Positioning: React.FC<{ t: Tokens }> = ({ t }) => (
  <SceneShell duration={SCENES.positioning.duration}>
    <AbsoluteFill style={{ padding: `0 ${PAD_X}px`, justifyContent: 'center' }}>
      <Eyebrow text="What I build" t={t} start={2} framesPerChar={2} />
      <WordReveal
        text={POSITIONING_LINES}
        start={12}
        stagger={2}
        accentWords={POSITIONING_ACCENT}
        accent={t.accent}
        style={{ ...Headline, fontSize: 88, lineHeight: 1.1, color: t.fg, marginTop: 36, maxWidth: 1440 }}
      />
    </AbsoluteFill>
  </SceneShell>
);

/* 3 · Tech stack, 9–15 s ---------------------------------------------------- */
export const Stack: React.FC<{ t: Tokens }> = ({ t }) => {
  const frame = useCurrentFrame();
  const cols = 4;
  const cell = { w: 212, h: 168 };
  const sub = ease(frame, 30, 18);
  return (
    <SceneShell duration={SCENES.stack.duration}>
      <AbsoluteFill
        style={{
          padding: `0 ${PAD_X}px`,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ width: 560 }}>
          <Eyebrow text="Stack" t={t} start={2} />
          <WordReveal
            text={STACK_HEADING}
            start={10}
            stagger={4}
            style={{ ...Headline, fontSize: 96, color: t.fg, marginTop: 28 }}
          />
          <div
            style={{
              fontFamily: FONT_SANS,
              fontSize: 30,
              lineHeight: 1.45,
              color: t.muted,
              marginTop: 28,
              opacity: sub,
              transform: `translateY(${(1 - sub) * 14}px)`,
            }}
          >
            {STACK_SUB}
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, ${cell.w}px)`,
            borderTop: `1px solid ${t.line}`,
            borderLeft: `1px solid ${t.line}`,
          }}
        >
          {STACK_ICONS.map((ic, i) => {
            const r = Math.floor(i / cols);
            const c = i % cols;
            const p = ease(frame, 16 + (r + c) * 4, 20);
            // A single accent wave runs across the grid once everything is in.
            const wave = interpolate(frame - 95 - (r + c) * 5, [0, 8, 22], [0, 1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <div
                key={ic.label}
                style={{
                  width: cell.w,
                  height: cell.h,
                  borderRight: `1px solid ${t.line}`,
                  borderBottom: `1px solid ${t.line}`,
                  boxShadow: `inset 0 0 0 999px ${t.accentSoft.replace(/[\d.]+\)$/, (m) => `${(parseFloat(m) * wave).toFixed(3)})`)}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 18,
                }}
              >
                <div
                  style={{
                    opacity: p,
                    transform: `translateY(${(1 - p) * 18}px) scale(${0.9 + 0.1 * p})`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 18,
                  }}
                >
                  <svg viewBox="0 0 24 24" width={52} height={52} aria-label={ic.source}>
                    <path d={ic.path} fill={wave > 0.5 ? t.accent : t.fg} />
                  </svg>
                  <div
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 16,
                      color: t.muted,
                      textAlign: 'center',
                      lineHeight: 1.3,
                      maxWidth: cell.w - 24,
                    }}
                  >
                    {ic.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

/* 4 · Projects, 15–35 s ----------------------------------------------------- */
const ProjectSlide: React.FC<{ t: Tokens; p: Project; index: number }> = ({ t, p, index }) => {
  const frame = useCurrentFrame();
  const dev = ease(frame, 4, 26);
  const chipsIn = (i: number) => ease(frame, 30 + i * 3, 16);
  const hold = 62;
  const browser = { w: 980, h: 612 };
  const phone = { w: 960, h: 480 };
  const device =
    p.device === 'browser' ? (
      <BrowserFrame t={t} url={p.url} width={browser.w} height={browser.h}>
        <ShotCycle shots={p.shots} start={0} hold={hold} bg={t.surface2} />
      </BrowserFrame>
    ) : (
      <PhoneFrame t={t} width={phone.w} height={phone.h}>
        <ShotCycle shots={p.shots} start={0} hold={hold} bg="#000" />
      </PhoneFrame>
    );

  return (
    <SceneShell duration={PROJECT_DURATION}>
      <AbsoluteFill
        style={{
          padding: `0 ${PAD_X - 40}px 0 ${PAD_X}px`,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ width: 540 }}>
          <Eyebrow
            text={`0${index + 1} / 0${PROJECTS.length} · ${p.meta}`}
            t={t}
            start={0}
            framesPerChar={1}
            cursor={false}
          />
          <WordReveal
            text={p.name}
            start={6}
            style={{ ...Headline, fontSize: 92, color: t.fg, marginTop: 26 }}
          />
          <WordReveal
            text={p.subtitle}
            start={14}
            stagger={2}
            style={{ fontFamily: FONT_SANS, fontSize: 34, lineHeight: 1.3, color: t.muted, marginTop: 22, fontWeight: 400 }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 40 }}>
            {p.tech.map((label, i) => (
              <Chip
                key={label}
                label={label}
                t={t}
                style={{ opacity: chipsIn(i), transform: `translateY(${(1 - chipsIn(i)) * 10}px)` }}
              />
            ))}
          </div>
          <div
            style={{
              marginTop: 40,
              fontFamily: FONT_MONO,
              fontSize: 18,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: t.faint,
              opacity: ease(frame, 44, 16),
            }}
          >
            {p.category}
          </div>
        </div>
        <div
          style={{
            opacity: dev,
            transform: `translateX(${(1 - dev) * 120}px)`,
            position: 'relative',
          }}
        >
          {device}
          {/* screenshot progress: one segment per shot */}
          <div style={{ display: 'flex', gap: 8, marginTop: 24, justifyContent: 'center' }}>
            {p.shots.map((s, i) => {
              const on = frame >= i * hold - 8 && frame < (i + 1) * hold - 8;
              return (
                <div
                  key={s.src}
                  style={{ width: on ? 40 : 16, height: 4, background: on ? t.accent : t.lineStrong }}
                />
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

export const Projects: React.FC<{ t: Tokens }> = ({ t }) => (
  <AbsoluteFill>
    {PROJECTS.map((p, i) => (
      <Sequence key={p.name} from={i * PROJECT_DURATION} durationInFrames={PROJECT_DURATION}>
        <ProjectSlide t={t} p={p} index={i} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

/* 5 · CTA, 35–40 s ---------------------------------------------------------- */
export const Cta: React.FC<{ t: Tokens }> = ({ t }) => {
  const frame = useCurrentFrame();
  const pill = ease(frame, 30, 20);
  // Pointer glides to the link and presses it, as on the site's buttons (scale 0.97).
  const px = interpolate(frame, [50, 78], [1500, 1060], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_IN_OUT,
  });
  const py = interpolate(frame, [50, 78], [980, 742], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_IN_OUT,
  });
  const press = interpolate(frame, [82, 86, 92], [1, 0.97, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pointerOpacity = ease(frame, 48, 8);
  // Everything fades to the bare canvas so frame 1199 → frame 0 loops cleanly.
  const out = ease(frame, 128, 22, 0, 1, EASE_IN_OUT);

  return (
    <AbsoluteFill style={{ opacity: 1 - out, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Eyebrow text={PERSON.title} t={t} start={0} framesPerChar={1} />
        <WordReveal
          text={PERSON.name}
          start={8}
          stagger={5}
          style={{ ...Headline, fontSize: 150, color: t.fg, marginTop: 26, justifyContent: 'center' }}
        />
        <div
          style={{
            marginTop: 26,
            fontFamily: FONT_MONO,
            fontSize: 22,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: t.muted,
            opacity: ease(frame, 22, 16),
          }}
        >
          {PERSON.location}
        </div>
        <div
          style={{
            marginTop: 56,
            opacity: pill,
            transform: `translateY(${(1 - pill) * 16}px) scale(${press})`,
            background: t.accent,
            color: t.accentFg,
            fontFamily: FONT_MONO,
            fontWeight: 500,
            fontSize: 34,
            padding: '22px 40px',
            display: 'flex',
            alignItems: 'center',
            gap: 18,
          }}
        >
          {PERSON.url}
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={t.accentFg} strokeWidth={2.2}>
            <path d="M7 17L17 7M9 7h8v8" strokeLinecap="square" />
          </svg>
        </div>
      </div>
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        style={{ position: 'absolute', left: px, top: py, opacity: pointerOpacity }}
      >
        <path
          d="M4 2l15 9.5-6.6 1.2 3.9 7.4-2.7 1.4-3.9-7.4L4 18.5z"
          fill={t.fg}
          stroke={t.bg}
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
      </svg>
    </AbsoluteFill>
  );
};
