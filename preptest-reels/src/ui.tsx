import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Outfit";

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

export const C = {
  navy: "#0F1B2D",
  orange: "#FF4D12",
  orangeSoft: "#FF8A4C",
  blue: "#1E7BFF",
  sky: "#8EC5FF",
  green: "#16A34A",
  muted: "#5B6475",
  line: "#E6E8EC",
  bg: "#FFFFFF",
};

export const useSpring = (delay = 0, config = { damping: 14, stiffness: 140, mass: 0.7 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
};

/** White canvas with the poster's soft orange arc in the lower half. */
export const Backdrop: React.FC<{ arc?: number; children?: React.ReactNode }> = ({ arc = 1, children }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 40) * 20;
  return (
    <div style={{ position: "absolute", inset: 0, background: C.bg, overflow: "hidden", fontFamily }}>
      <div
        style={{
          position: "absolute",
          width: 2200,
          height: 2200,
          left: -560 + drift,
          top: 1180,
          borderRadius: "50%",
          opacity: arc,
          background: `radial-gradient(circle at 50% 30%, #FFB48A 0%, ${C.orangeSoft} 30%, ${C.orange} 60%, #FFF 61%)`,
          filter: "blur(2px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 2400,
          height: 2400,
          left: -660 + drift,
          top: 1260,
          borderRadius: "50%",
          opacity: arc,
          background: "radial-gradient(circle, #FFFFFF 0%, #FFFFFF 55%, rgba(255,255,255,0) 62%)",
        }}
      />
      {children}
    </div>
  );
};

/** Orange play button with three "burst" rays, as in the poster's CEnT-S lockup. */
export const PlayBurst: React.FC<{ size: number; delay?: number }> = ({ size, delay = 0 }) => {
  const frame = useCurrentFrame();
  const s = useSpring(delay, { damping: 9, stiffness: 160, mass: 0.6 });
  const ray = interpolate(frame - delay - 6, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 1 + Math.sin((frame - delay) / 6) * 0.025;
  return (
    <div style={{ position: "relative", width: size, height: size, transform: `scale(${s * pulse})` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C.orange }} />
      <div
        style={{
          position: "absolute",
          left: size * 0.38,
          top: size * 0.27,
          width: 0,
          height: 0,
          borderTop: `${size * 0.23}px solid transparent`,
          borderBottom: `${size * 0.23}px solid transparent`,
          borderLeft: `${size * 0.36}px solid white`,
          borderRadius: 6,
        }}
      />
      {[-38, 0, 38].map((deg, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: size * 1.08,
            top: size / 2 - size * 0.05,
            width: size * 0.42 * ray,
            height: size * 0.1,
            borderRadius: 99,
            background: C.orange,
            transformOrigin: `-${size * 0.58}px 50%`,
            transform: `rotate(${deg}deg)`,
          }}
        />
      ))}
    </div>
  );
};

/** Words slide up one after another. */
export const Kinetic: React.FC<{
  text: string;
  delay?: number;
  size: number;
  color?: string;
  weight?: number;
  stagger?: number;
  highlight?: string[];
  align?: "center" | "left";
  lineHeight?: number;
}> = ({ text, delay = 0, size, color = C.navy, weight = 900, stagger = 3, highlight = [], align = "center", lineHeight = 1.02 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = text.split("\n");
  let idx = 0;
  return (
    <div style={{ fontFamily, fontWeight: weight, fontSize: size, lineHeight, textAlign: align, letterSpacing: -size * 0.025 }}>
      {lines.map((line, li) => (
        <div key={li} style={{ display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", gap: `0 ${size * 0.24}px` }}>
          {line.split(" ").map((w, wi) => {
            const d = delay + idx++ * stagger;
            const p = spring({ frame: frame - d, fps, config: { damping: 15, stiffness: 170, mass: 0.6 } });
            const hl = highlight.some((h) => w.toLowerCase().includes(h.toLowerCase()));
            return (
              <span key={wi} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.08 }}>
                <span
                  style={{
                    display: "inline-block",
                    color: hl ? C.orange : color,
                    transform: `translateY(${(1 - p) * 110}%)`,
                    opacity: p > 0.02 ? 1 : 0,
                  }}
                >
                  {w}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const Logo: React.FC<{ width: number; delay?: number }> = ({ width, delay = 0 }) => {
  const p = useSpring(delay);
  return (
    <Img
      src={staticFile("img/logo.png")}
      style={{ width, transform: `translateY(${(1 - p) * -40}px)`, opacity: p }}
    />
  );
};

export const Pill: React.FC<{ children: React.ReactNode; bg?: string; color?: string; size?: number; style?: React.CSSProperties }> = ({
  children,
  bg = C.navy,
  color = "white",
  size = 34,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      background: bg,
      color,
      fontFamily,
      fontWeight: 800,
      fontSize: size,
      padding: `${size * 0.35}px ${size * 0.8}px`,
      borderRadius: 999,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Check: React.FC<{ size: number; color?: string }> = ({ size, color = C.orange }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24">
      <path d="M4 12.5l5 5L20 6.5" stroke="white" strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);
