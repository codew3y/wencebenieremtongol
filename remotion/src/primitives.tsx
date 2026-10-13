import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
} from "remotion";
import { FONT_MONO, FONT_SANS, Tokens } from "./theme";

export const ease = (
  frame: number,
  start: number,
  duration: number,
  from = 0,
  to = 1,
) =>
  interpolate(frame, [start, start + duration], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
export const settle = (frame: number, delay = 0) =>
  spring({
    frame: frame - delay,
    fps: 30,
    config: { damping: 22, stiffness: 110, mass: 0.8 },
  });
export const headline: React.CSSProperties = {
  fontFamily: FONT_SANS,
  fontWeight: 650,
  letterSpacing: "-0.065em",
  lineHeight: 0.94,
};
export const Label: React.FC<{
  children: React.ReactNode;
  t: Tokens;
  style?: React.CSSProperties;
}> = ({ children, t, style }) => (
  <div
    style={{
      fontFamily: FONT_MONO,
      fontSize: 26,
      fontWeight: 500,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: t.muted,
      ...style,
    }}
  >
    {children}
  </div>
);
export const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, style }) => {
  const p = settle(useCurrentFrame(), delay);
  return (
    <div
      style={{
        opacity: Math.min(1, p),
        transform: `translateY(${(1 - p) * 70}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
export const Scene: React.FC<{
  duration: number;
  children: React.ReactNode;
}> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const out = ease(frame, duration - 10, 10);
  return (
    <AbsoluteFill
      style={{ opacity: 1 - out, transform: `translateY(${-28 * out}px)` }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** A projected, rotating wire cube. Deterministic at every frame, including seeking. */
export const Core: React.FC<{ t: Tokens; phase: number; size?: number }> = ({
  t,
  phase,
  size = 700,
}) => {
  const loop = phase % 1;
  const a = loop * Math.PI * 2;
  const points = Array.from({ length: 8 }, (_, i) => {
    const x = i & 1 ? 1 : -1,
      y = i & 2 ? 1 : -1,
      z = i & 4 ? 1 : -1;
    const rx = x * Math.cos(a) - z * Math.sin(a);
    const rz = x * Math.sin(a) + z * Math.cos(a);
    const ry = y * Math.cos(0.55) - rz * Math.sin(0.55);
    const depth = y * Math.sin(0.55) + rz * Math.cos(0.55);
    const p = 145 / (1 + depth * 0.12);
    return [350 + rx * p, 350 + ry * p];
  });
  return (
    <svg width={size} height={size} viewBox="0 0 700 700" fill="none">
      <circle
        cx="350"
        cy="350"
        r="316"
        stroke={t.lineStrong}
        strokeWidth="2"
        strokeDasharray="3 15"
      />
      {[0, 60, 120].map((r) => (
        <g key={r} transform={`rotate(${r + loop * 360} 350 350)`}>
          <ellipse
            cx="350"
            cy="350"
            rx="292"
            ry="106"
            stroke={t.accent}
            strokeWidth="2"
            opacity="0.5"
          />
          <circle cx="642" cy="350" r="7" fill={t.accent} />
        </g>
      ))}
      {points.flatMap((p, i) =>
        [1, 2, 4]
          .filter((bit) => !(i & bit))
          .map((bit) => {
            const q = points[i | bit];
            return (
              <line
                key={`${i}-${bit}`}
                x1={p[0]}
                y1={p[1]}
                x2={q[0]}
                y2={q[1]}
                stroke={t.accent}
                strokeWidth="3"
              />
            );
          }),
      )}
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="5" fill={t.accent} />
      ))}
      <path d="M330 350h40M350 330v40" stroke={t.fg} strokeWidth="2" />
    </svg>
  );
};
