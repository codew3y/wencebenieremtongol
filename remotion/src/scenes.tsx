import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  Core,
  ease,
  headline,
  Label,
  Reveal,
  Scene,
  settle,
} from "./primitives";
import { FONT_MONO, Tokens } from "./theme";
import { PROJECTS } from "./content";
import { ProjectUI } from "./ProjectUI";
import { TOTAL_FRAMES } from "./timing";

type Props = { t: Tokens };
const title = (t: Tokens, size = 154): React.CSSProperties => ({
  ...headline,
  color: t.fg,
  fontSize: size,
});

export const Identity: React.FC<
  Props & { closing?: boolean; globalFrame: number }
> = ({ t, closing = false, globalFrame }) => {
  const f = useCurrentFrame();
  const extra = closing
    ? ease(f, 0, 16) * (1 - ease(f, 65, 40))
    : ease(f, 12, 24) * (1 - ease(f, 92, 24));
  const out = closing ? 0 : ease(f, 110, 10);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <div style={{ position: "absolute", left: 116, top: 233 }}>
        <Label t={t} style={{ color: t.accent, marginBottom: 38 }}>
          Full-stack developer
        </Label>
        <div style={title(t, 214)}>
          Wence
          <br />
          Tongol<span style={{ color: t.accent }}>.</span>
        </div>
        <div
          style={{
            marginTop: 45,
            width: 680,
            height: 2,
            background: t.lineStrong,
          }}
        />
        <Label t={t} style={{ marginTop: 28 }}>
          Pampanga, Philippines
        </Label>
      </div>
      <div style={{ position: "absolute", right: 116, top: 164 }}>
        <Core t={t} phase={globalFrame / (TOTAL_FRAMES - 1)} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 142,
          top: 837,
          color: t.accent,
          fontFamily: FONT_MONO,
          fontSize: 30,
          opacity: extra,
        }}
      >
        {closing
          ? "Have an idea? Let’s build it. ↗"
          : "Interfaces. Systems. Possibilities."}
      </div>
    </AbsoluteFill>
  );
};

export const Blueprint: React.FC<Props> = ({ t }) => {
  const f = useCurrentFrame();
  const nodes = ["Idea", "Interface", "API", "Data"];
  return (
    <Scene duration={120}>
      <div style={{ position: "absolute", left: 116, top: 196 }}>
        <Reveal>
          <Label t={t}>From the first sketch</Label>
        </Reveal>
        <Reveal delay={5} style={{ ...title(t, 156), marginTop: 34 }}>
          Make it <span style={{ color: t.accent }}>real.</span>
        </Reveal>
      </div>
      <svg width="1920" height="1080" style={{ position: "absolute" }}>
        <path d="M295 654H1610" stroke={t.lineStrong} strokeWidth="3" />
        <path
          d="M295 654H1610"
          stroke={t.accent}
          strokeWidth="4"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - ease(f, 20, 60)}
        />
        <circle
          cx={interpolate(f, [20, 80], [295, 1610], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          cy="654"
          r="9"
          fill={t.accent}
        />
      </svg>
      {nodes.map((n, i) => {
        const p = settle(f, 12 + i * 12);
        return (
          <div
            key={n}
            style={{
              position: "absolute",
              left: 116 + i * 440,
              top: 548,
              width: 355,
              height: 212,
              background: i === 0 ? t.accent : t.surface,
              border: `2px solid ${i === 0 ? t.accent : t.lineStrong}`,
              borderRadius: 24,
              padding: 32,
              boxSizing: "border-box",
              opacity: Math.min(1, p),
              transform: `translateY(${(1 - p) * 90}px) scale(${0.92 + p * 0.08})`,
            }}
          >
            <Label t={t} style={{ color: i === 0 ? t.accentFg : t.accent }}>
              0{i + 1}
            </Label>
            <div
              style={{
                ...title(t, 58),
                color: i === 0 ? t.accentFg : t.fg,
                marginTop: 31,
                letterSpacing: "-0.045em",
              }}
            >
              {n}
            </div>
          </div>
        );
      })}
      <Reveal delay={60} style={{ position: "absolute", left: 116, top: 823 }}>
        <Label t={t}>Thoughtful interfaces. Connected systems.</Label>
      </Reveal>
    </Scene>
  );
};

export const Product: React.FC<Props & { index: 0 | 1 }> = ({ t, index }) => {
  const f = useCurrentFrame();
  const project = PROJECTS[index];
  const isJobs = index === 0;
  const appear = settle(f, 8);
  return (
    <Scene duration={150}>
      <div style={{ position: "absolute", left: 116, top: 194, width: 540 }}>
        <Reveal>
          <Label t={t} style={{ color: t.accent }}>
            Selected work / 0{index + 1}
          </Label>
        </Reveal>
        <Reveal delay={4} style={{ ...title(t, 96), marginTop: 34 }}>
          {project.name}
        </Reveal>
        <Reveal
          delay={10}
          style={{
            ...title(t, 60),
            lineHeight: 1.1,
            marginTop: 36,
            letterSpacing: "-0.04em",
            color: t.muted,
          }}
        >
          {isJobs ? (
            <>
              Good work.
              <br />
              Better matches.
            </>
          ) : (
            <>
              Less waiting.
              <br />
              More fresh cuts.
            </>
          )}
        </Reveal>
        <Reveal delay={25} style={{ marginTop: 38 }}>
          <Label t={t} style={{ fontSize: 22 }}>
            {isJobs
              ? "Next.js · Supabase · AI matching"
              : "Next.js · TypeScript · Booking"}
          </Label>
        </Reveal>
      </div>
      <div
        style={{
          position: "absolute",
          left: 704,
          top: 194,
          width: 1100,
          height: 720,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          transform: "none",
          perspective: "none",
          opacity: Math.min(1, appear),
          borderRadius: 24,
          overflow: "hidden",
          border: `2px solid ${t.lineStrong}`,
          background: t.frame,
          boxShadow: t.shadow,
        }}
      >
        <div
          style={{
            height: 54,
            flex: "0 0 54px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "0 24px",
            background: t.frameBar,
          }}
        >
          {[0, 1, 2].map((n) => (
            <span
              key={n}
              style={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                background: t.dot,
              }}
            />
          ))}
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 22,
              color: t.muted,
              marginLeft: 22,
            }}
          >
            {project.url}
          </span>
        </div>
        <div
          style={{
            position: "relative",
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <ProjectUI t={t} index={index} />
        </div>
      </div>
      <Reveal
        delay={36}
        style={{
          position: "absolute",
          left: 116,
          bottom: 167,
          width: 540,
          borderTop: `2px solid ${t.lineStrong}`,
          paddingTop: 25,
        }}
      >
        <Label t={t}>
          {isJobs
            ? "Evidence over keywords."
            : "Pick a barber. Find your time."}
        </Label>
      </Reveal>
    </Scene>
  );
};

export const Systems: React.FC<Props> = ({ t }) => {
  const f = useCurrentFrame();
  const nodes = [
    { icon: "✦", name: "AI assistant", sub: "Claude" },
    { icon: "{ }", name: "MCP connector", sub: "Azure · Entra ID" },
    { icon: "↗", name: "Enterprise APIs", sub: "Graph · Purview · Bexio" },
  ];
  return (
    <Scene duration={150}>
      <div style={{ position: "absolute", left: 116, top: 175 }}>
        <Reveal>
          <Label t={t} style={{ color: t.accent }}>
            Beyond the interface
          </Label>
        </Reveal>
        <Reveal delay={6} style={{ ...title(t, 138), marginTop: 34 }}>
          Everything, <span style={{ color: t.accent }}>connected.</span>
        </Reveal>
      </div>
      <svg width="1920" height="1080" style={{ position: "absolute" }}>
        {[0, 1].map((i) => (
          <g key={i}>
            <path
              d={`M${520 + i * 590} 648H${707 + i * 590}`}
              stroke={t.lineStrong}
              strokeWidth="3"
            />
            {[0, 1, 2].map((j) => (
              <circle
                key={j}
                cx={520 + i * 590 + ((f * 3 + j * 62) % 187)}
                cy="648"
                r="6"
                fill={t.accent}
                opacity={ease(f, 30 + i * 18, 15)}
              />
            ))}
          </g>
        ))}
      </svg>
      {nodes.map((node, i) => (
        <Reveal
          key={node.name}
          delay={15 + i * 12}
          style={{
            position: "absolute",
            left: 116 + i * 590,
            top: 466,
            width: 500,
            height: 320,
            boxSizing: "border-box",
            border: `2px solid ${t.lineStrong}`,
            background: t.surface,
            borderRadius: 24,
            padding: 38,
          }}
        >
          <div
            style={{
              fontFamily: FONT_MONO,
              color: t.accent,
              fontSize: 72,
              height: 92,
            }}
          >
            {node.icon}
          </div>
          <div
            style={{ ...title(t, 48), letterSpacing: "-0.04em", marginTop: 19 }}
          >
            {node.name}
          </div>
          <Label t={t} style={{ marginTop: 27, fontSize: 23 }}>
            {node.sub}
          </Label>
        </Reveal>
      ))}
      <Reveal delay={65} style={{ position: "absolute", left: 116, top: 845 }}>
        <Label t={t}>Per-user identity. Least privilege. Audit trails.</Label>
      </Reveal>
    </Scene>
  );
};

export const Vista: React.FC<Props> = ({ t }) => {
  const f = useCurrentFrame();
  const p = settle(f, 4);
  return (
    <Scene duration={90}>
      <div style={{ position: "absolute", left: 116, top: 222 }}>
        <Reveal>
          <Label t={t} style={{ color: t.accent }}>
            A different perspective
          </Label>
        </Reveal>
        <Reveal delay={5} style={{ ...title(t, 132), marginTop: 40 }}>
          Vista<span style={{ color: t.accent }}>VR</span>
        </Reveal>
        <Reveal
          delay={10}
          style={{
            ...title(t, 65),
            color: t.muted,
            lineHeight: 1.1,
            marginTop: 39,
          }}
        >
          Eye testing.
          <br />
          Another dimension.
        </Reveal>
        <Reveal delay={17} style={{ marginTop: 46 }}>
          <Label t={t}>Unity · C# · Capstone project</Label>
        </Reveal>
      </div>
      <div
        style={{
          position: "absolute",
          left: 754,
          top: 239,
          width: 1050,
          height: 524,
          borderRadius: 140,
          border: `3px solid ${t.accent}`,
          padding: 20,
          boxSizing: "border-box",
          background: t.surface2,
          transform: "none",
          perspective: "none",
          opacity: Math.min(1, p),
          boxShadow: t.shadow,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRadius: 120,
            position: "relative",
            background: "#000",
          }}
        >
          <Img
            src={staticFile("shots/VR2.webp")}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: `2px solid ${t.accent}`,
              borderRadius: 120,
              opacity: 0.45,
            }}
          />
        </div>
      </div>
    </Scene>
  );
};
