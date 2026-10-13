import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { FONT_MONO, FONT_SANS, Tokens } from './theme';
import { EXIT_FRAMES } from './timing';

// Same curves as the site (src/lib/motion.js).
export const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);
export const EASE_IN_OUT = Easing.bezier(0.77, 0, 0.175, 1);

export const ease = (
  frame: number,
  start: number,
  duration: number,
  from = 0,
  to = 1,
  easing = EASE_OUT,
) =>
  interpolate(frame, [start, start + duration], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/** Wraps a scene: content rises out and fades during the last EXIT_FRAMES. */
export const SceneShell: React.FC<{
  duration: number;
  children: React.ReactNode;
  exit?: boolean;
}> = ({ duration, children, exit = true }) => {
  const frame = useCurrentFrame();
  const t = exit ? ease(frame, duration - EXIT_FRAMES, EXIT_FRAMES, 0, 1, EASE_IN_OUT) : 0;
  return (
    <AbsoluteFill
      style={{
        opacity: 1 - t,
        transform: `translateY(${-36 * t}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Uppercase mono label with wide tracking, typed out with a blinking cursor. */
export const Eyebrow: React.FC<{
  text: string;
  t: Tokens;
  start?: number;
  framesPerChar?: number;
  cursor?: boolean;
  size?: number;
  color?: string;
}> = ({ text, t, start = 0, framesPerChar = 2, cursor = true, size = 22, color }) => {
  const frame = useCurrentFrame();
  const shown = Math.max(0, Math.min(text.length, Math.floor((frame - start) / framesPerChar)));
  const typing = frame >= start && shown < text.length;
  // Solid while typing, then blinks on a 16-frame period like a terminal caret.
  const caretOn = typing || Math.floor((frame - start) / 16) % 2 === 0;
  return (
    <div
      style={{
        fontFamily: FONT_MONO,
        fontWeight: 500,
        fontSize: size,
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        color: color ?? t.accent,
        display: 'flex',
        alignItems: 'center',
        height: size * 1.4,
        whiteSpace: 'pre',
      }}
    >
      <span>{text.slice(0, shown)}</span>
      {cursor && frame >= start ? (
        <span
          style={{
            display: 'inline-block',
            width: size * 0.55,
            height: size * 1.15,
            marginLeft: 2,
            background: color ?? t.accent,
            opacity: caretOn ? 1 : 0,
          }}
        />
      ) : null}
    </div>
  );
};

/** Words rise from a clipped baseline one after another. */
export const WordReveal: React.FC<{
  text: string;
  start?: number;
  stagger?: number;
  style?: React.CSSProperties;
  accentWords?: string[];
  accent?: string;
}> = ({ text, start = 0, stagger = 3, style, accentWords = [], accent }) => {
  const frame = useCurrentFrame();
  // A "\n" in the text forces a line break.
  const words = text.replace(/\n/g, ' \n ').split(' ').filter(Boolean);
  let n = 0;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: '0.24em', ...style }}>
      {words.map((w, idx) => {
        if (w === '\n') return <span key={idx} style={{ flexBasis: '100%', height: 0 }} />;
        const i = n++;
        const p = ease(frame, start + i * stagger, 18);
        return (
          <span
            key={idx}
            style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em' }}
          >
            <span
              style={{
                display: 'inline-block',
                transform: `translateY(${(1 - p) * 105}%)`,
                opacity: p,
                color: accentWords.includes(w) ? accent : undefined,
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

export const Chip: React.FC<{ label: string; t: Tokens; style?: React.CSSProperties }> = ({
  label,
  t,
  style,
}) => (
  <div
    style={{
      fontFamily: FONT_MONO,
      fontSize: 18,
      color: t.muted,
      border: `1px solid ${t.line}`,
      background: t.surface,
      padding: '8px 14px',
      letterSpacing: '0.02em',
      ...style,
    }}
  >
    {label}
  </div>
);

/** Crossfades through screenshots with a slow push-in on each. */
export const ShotCycle: React.FC<{
  shots: { src: string }[];
  start: number;
  hold: number;
  fit?: 'cover' | 'contain';
  bg: string;
}> = ({ shots, start, hold, fit = 'cover', bg }) => {
  const frame = useCurrentFrame();
  const local = frame - start;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: bg }}>
      {shots.map((s, i) => {
        const inAt = i * hold;
        const opacity = i === 0 ? 1 : ease(local, inAt - 8, 14, 0, 1, EASE_IN_OUT);
        const scale = interpolate(local, [inAt - 8, inAt + hold + 8], [1.0, 1.045], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <Img
            key={s.src}
            src={staticFile(s.src)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: fit,
              objectPosition: 'top center',
              opacity,
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
            }}
          />
        );
      })}
    </div>
  );
};

export const BrowserFrame: React.FC<{
  t: Tokens;
  url?: string;
  width: number;
  height: number;
  children: React.ReactNode;
}> = ({ t, url, width, height, children }) => (
  <div
    style={{
      width,
      height,
      border: `1px solid ${t.lineStrong}`,
      background: t.frame,
      boxShadow: t.shadow,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <div
      style={{
        height: 52,
        flex: '0 0 52px',
        borderBottom: `1px solid ${t.line}`,
        background: t.frameBar,
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 10,
      }}
    >
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: t.dot }} />
      ))}
      {url ? (
        <div
          style={{
            marginLeft: 20,
            flex: 1,
            maxWidth: 520,
            height: 30,
            border: `1px solid ${t.line}`,
            background: t.frame,
            fontFamily: FONT_MONO,
            fontSize: 15,
            color: t.muted,
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
          }}
        >
          {url}
        </div>
      ) : null}
    </div>
    <div style={{ position: 'relative', flex: 1 }}>{children}</div>
  </div>
);

/** A landscape phone, for VistaVR (a mobile app viewed in a headset). */
export const PhoneFrame: React.FC<{
  t: Tokens;
  width: number;
  height: number;
  children: React.ReactNode;
}> = ({ t, width, height, children }) => (
  <div
    style={{
      width,
      height,
      borderRadius: 56,
      padding: 18,
      background: t.frame,
      border: `1px solid ${t.lineStrong}`,
      boxShadow: t.shadow,
      position: 'relative',
    }}
  >
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 40, overflow: 'hidden' }}>
      {children}
    </div>
    {/* camera notch on the short edge */}
    <div
      style={{
        position: 'absolute',
        left: 30,
        top: '50%',
        width: 10,
        height: 10,
        borderRadius: 5,
        marginTop: -5,
        background: t.dot,
      }}
    />
  </div>
);

export const Headline: React.CSSProperties = {
  fontFamily: FONT_SANS,
  fontWeight: 600,
  letterSpacing: '-0.035em',
  lineHeight: 1.02,
};
