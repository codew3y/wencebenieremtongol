import React from "react";
import { useCurrentFrame } from "remotion";
import { ease, headline } from "./primitives";
import { FONT_MONO, FONT_SANS, Tokens } from "./theme";

// Shared coordinates apply to both apps and both screens. Content never moves
// between screens: only opacity changes. Every control uses border-box sizing.
const GRID = {
  inset: 40,
  headerTop: 24,
  headerHeight: 72,
  bodyTop: 132,
  landingHeight: 344,
  controlHeight: 48,
};
export const ProjectUI: React.FC<{ t: Tokens; index: 0 | 1 }> = ({
  t,
  index,
}) => {
  const f = useCurrentFrame();
  const jobs = index === 0;
  const dark = t.bg === "#101013";
  const accent = jobs ? t.accent : dark ? "#d9bc72" : "#765712";
  const accentFg = jobs ? t.accentFg : dark ? "#080706" : "#ffffff";
  const step = f < 75 ? 0 : 1;
  const opacity = step === 0 ? 1 - ease(f, 69, 6) : ease(f, 75, 6);
  const eyebrow: React.CSSProperties = {
    fontFamily: FONT_MONO,
    fontSize: 16,
    lineHeight: "24px",
    letterSpacing: "0.06em",
    color: accent,
    whiteSpace: "nowrap",
  };
  const button: React.CSSProperties = {
    boxSizing: "border-box",
    height: GRID.controlHeight,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: "0 18px",
    border: `1px solid ${accent}`,
    borderRadius: 8,
    fontSize: 18,
    fontWeight: 600,
    lineHeight: "24px",
    whiteSpace: "nowrap",
    background: accent,
    color: accentFg,
  };
  const secondary: React.CSSProperties = {
    ...button,
    background: t.surface,
    color: t.fg,
    borderColor: t.lineStrong,
  };
  const row: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 32px",
    alignItems: "center",
    columnGap: 16,
    minWidth: 0,
  };
  const mark: React.CSSProperties = {
    display: "grid",
    placeItems: "center",
    width: 32,
    height: 32,
    color: accent,
    lineHeight: "32px",
    fontSize: 25,
  };
  const body: React.CSSProperties = {
    position: "absolute",
    left: GRID.inset,
    right: GRID.inset,
    top: GRID.bodyTop,
    opacity,
  };
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: t.bg,
        color: t.fg,
        fontFamily: FONT_SANS,
        lineHeight: 1.4,
      }}
    >
      <div
        data-ui="header"
        style={{
          position: "absolute",
          left: GRID.inset,
          right: GRID.inset,
          top: GRID.headerTop,
          height: GRID.headerHeight,
          boxSizing: "border-box",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto",
          alignItems: "start",
          borderBottom: `1px solid ${t.lineStrong}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            height: 44,
            fontSize: 27,
            fontWeight: 650,
            letterSpacing: "-0.04em",
            lineHeight: "32px",
          }}
        >
          <span style={mark}>{jobs ? "⌘" : "✂"}</span>
          <span>{jobs ? "TechSelect" : "BarberHouse"}</span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "100px 100px 152px",
            gap: 16,
            alignItems: "center",
            height: 44,
            fontSize: 18,
            lineHeight: "24px",
            color: t.muted,
          }}
        >
          <span style={{ textAlign: "center" }}>
            {jobs ? "Find work" : "Services"}
          </span>
          <span style={{ textAlign: "center" }}>
            {jobs ? "Developers" : "Barbers"}
          </span>
          <span style={{ ...button, height: 44 }}>
            {jobs ? "Get started ↗" : "Book now ↗"}
          </span>
        </div>
      </div>
      {step === 0 ? (
        <div
          data-ui="landing"
          style={{
            ...body,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
            gap: 32,
            height: GRID.landingHeight,
            alignItems: "stretch",
          }}
        >
          <div
            data-ui="intro"
            style={{
              display: "grid",
              gridTemplateRows: "24px 128px 72px 48px",
              rowGap: 24,
              minWidth: 0,
            }}
          >
            <div style={eyebrow}>
              {jobs ? "SOFTWARE · WEB · AUTOMATION" : "YOUR NEXT CUT, SORTED"}
            </div>
            <div
              data-ui="headline"
              style={{
                ...headline,
                fontSize: 58,
                lineHeight: "64px",
                letterSpacing: "-0.05em",
                margin: 0,
              }}
            >
              {jobs ? (
                <>
                  Hire builders,
                  <br />
                  not buzzwords.
                </>
              ) : (
                <>
                  Sharp looks.
                  <br />
                  Zero waiting room.
                </>
              )}
            </div>
            <div
              data-ui="description"
              style={{ fontSize: 20, lineHeight: "30px", color: t.muted }}
            >
              {jobs ? (
                <>
                  Real portfolios. Relevant matches.
                  <br />
                  Find the right people for your next project.
                </>
              ) : (
                <>
                  Choose a barber. Pick your service.
                  <br />
                  Book a time that works for you.
                </>
              )}
            </div>
            <div
              data-ui="actions"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 12,
                height: 48,
              }}
            >
              <div style={button}>
                {jobs ? "Find a developer ↗" : "Book your cut ↗"}
              </div>
              <div style={secondary}>
                {jobs ? "Browse jobs" : "View services"}
              </div>
            </div>
          </div>
          <div
            data-ui="summary"
            style={{
              boxSizing: "border-box",
              height: GRID.landingHeight,
              border: `1px solid ${t.lineStrong}`,
              borderRadius: 14,
              background: t.surface,
              padding: 24,
              display: "grid",
              gridTemplateRows: "24px repeat(3, minmax(0, 1fr))",
            }}
          >
            <div style={eyebrow}>
              {jobs ? "BUILT AROUND THE WORK" : "CUTS & SERVICES"}
            </div>
            {(jobs
              ? [
                  "Portfolio evidence",
                  "Semantic matching",
                  "Software, web & automation",
                ]
              : ["Classic haircut", "Skin fade", "Cut + beard"]
            ).map((text, i) => (
              <div
                key={text}
                data-ui="summary-row"
                style={{
                  ...row,
                  borderBottom: i < 2 ? `1px solid ${t.line}` : undefined,
                  fontSize: 20,
                  fontWeight: 500,
                  lineHeight: "28px",
                }}
              >
                <span style={{ minWidth: 0, whiteSpace: "nowrap" }}>
                  {text}
                </span>
                <span style={mark}>{jobs ? "↗" : "→"}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div data-ui="workspace" style={body}>
          <div
            data-ui="workspace-heading"
            style={{ display: "grid", gridTemplateRows: "24px 52px", gap: 12 }}
          >
            <div style={eyebrow}>
              {jobs ? "FIND YOUR NEXT PROJECT" : "BOOKING · BARBERHOUSE"}
            </div>
            <div
              style={{
                ...headline,
                fontSize: 44,
                lineHeight: "52px",
                letterSpacing: "-0.04em",
              }}
            >
              {jobs ? "Work worth building." : "Take a chair in three steps."}
            </div>
          </div>
          <div
            data-ui="filters"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 12,
              height: 44,
              marginTop: 20,
              marginBottom: 24,
            }}
          >
            {(jobs
              ? ["Search projects", "Web development", "Remote"]
              : ["01  Barber & service", "02  Time", "03  Review & checkout"]
            ).map((text, i) => (
              <div
                key={text}
                style={{
                  ...secondary,
                  height: 44,
                  fontSize: 17,
                  background: !jobs && i === 0 ? accent : t.surface2,
                  color: !jobs && i === 0 ? accentFg : t.muted,
                  borderColor: !jobs && i === 0 ? accent : t.lineStrong,
                  justifyContent: "flex-start",
                }}
              >
                {text}
              </div>
            ))}
          </div>
          {jobs ? (
            <div
              data-ui="results"
              style={{
                display: "grid",
                gridTemplateRows: "repeat(3, 88px)",
                gap: 12,
              }}
            >
              {[
                "Software & automation",
                "Web development",
                "API integrations",
              ].map((text) => (
                <div
                  key={text}
                  data-ui="result"
                  style={{
                    ...row,
                    height: 88,
                    boxSizing: "border-box",
                    border: `1px solid ${t.lineStrong}`,
                    borderRadius: 12,
                    padding: "14px 22px",
                    background: t.surface,
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateRows: "28px 24px",
                      gap: 4,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 600,
                        lineHeight: "28px",
                      }}
                    >
                      {text}
                    </div>
                    <div
                      style={{
                        fontSize: 17,
                        color: t.muted,
                        lineHeight: "24px",
                      }}
                    >
                      Portfolio-based matching · Remote
                    </div>
                  </div>
                  <span style={mark}>↗</span>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div
                data-ui="booking"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 16,
                }}
              >
                {["Select a barber", "Choose a service"].map((text, i) => (
                  <div
                    key={text}
                    data-ui="booking-column"
                    style={{
                      height: 240,
                      boxSizing: "border-box",
                      border: `1px solid ${t.lineStrong}`,
                      borderRadius: 12,
                      background: t.surface,
                      padding: 24,
                      display: "grid",
                      gridTemplateRows: "28px 60px 60px",
                      rowGap: 16,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 600,
                        lineHeight: "28px",
                      }}
                    >
                      {text}
                    </div>
                    {(i === 0
                      ? ["Choose your preferred barber", "View availability"]
                      : ["Classic haircut", "Skin fade"]
                    ).map((item, n) => (
                      <div
                        key={item}
                        data-ui="choice"
                        style={{
                          ...row,
                          height: 60,
                          boxSizing: "border-box",
                          padding: "0 14px",
                          borderRadius: 7,
                          border: `1px solid ${n === 0 ? accent : t.lineStrong}`,
                          fontSize: 18,
                          lineHeight: "26px",
                          color: n === 0 ? t.fg : t.muted,
                        }}
                      >
                        <span style={{ minWidth: 0, whiteSpace: "nowrap" }}>
                          {item}
                        </span>
                        <span style={{ ...mark, fontSize: 21 }}>
                          {n === 0 ? "✓" : "○"}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div
                data-ui="continue"
                style={{ ...button, height: 44, marginTop: 18, width: 176 }}
              >
                Continue →
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
