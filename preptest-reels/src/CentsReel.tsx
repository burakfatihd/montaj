import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { Backdrop, C, Check, Kinetic, Logo, Pill, PlayBurst, fontFamily, useSpring } from "./ui";

// Timeline (30 fps). 120 BPM → one beat = 15 frames; the drop lands on frame 240.
const S = {
  hook: [0, 42],
  brand: [42, 90],
  syllabus: [90, 150],
  count: [150, 240],
  montage: [240, 480],
  modes: [480, 585],
  test: [585, 720],
  features: [720, 795],
  cta: [795, 900],
} as const;
export const TOTAL = 900;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ───────────────────────── 1. Hook ─────────────────────────
const Hook: React.FC = () => (
  <Backdrop arc={0.0}>
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80 }}>
      <Kinetic text={"CEnT-S’e\nhazırlanıyor\nmusun?"} size={150} stagger={4} highlight={["hazırlanıyor"]} />
    </AbsoluteFill>
  </Backdrop>
);

// ───────────────────────── 2. Brand lockup ─────────────────────────
const Brand: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useSpring(0);
  const v = useSpring(10);
  return (
    <Backdrop arc={interpolate(frame, [0, 20], [0, 1], clamp)}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 300 }}>
        <Logo width={640} />
        <div style={{ display: "flex", alignItems: "center", marginTop: 120, transform: `scale(${0.8 + t * 0.2})`, opacity: t }}>
          <div style={{ fontFamily, fontWeight: 900, fontSize: 196, color: C.navy, letterSpacing: -8, lineHeight: 1, whiteSpace: "nowrap" }}>CEnT-S</div>
          <div style={{ marginLeft: 16, marginRight: 70 }}>
            <PlayBurst size={124} delay={6} />
          </div>
        </div>
        <div
          style={{
            fontFamily,
            fontWeight: 900,
            fontSize: 132,
            color: C.orange,
            letterSpacing: -5,
            whiteSpace: "nowrap",
            lineHeight: 1,
            marginTop: 10,
            clipPath: `inset(0 ${(1 - v) * 100}% 0 0)`,
          }}
        >
          VİDEO DERSLER
        </div>
        <div style={{ marginTop: 50 }}>
          <Kinetic text={"Yapay zekâ destekli derslerle\nadım adım öğren."} size={50} weight={800} delay={18} stagger={2} highlight={["adım", "öğren"]} />
        </div>
      </AbsoluteFill>
    </Backdrop>
  );
};

// ───────────────────────── 3. Syllabus analysed ─────────────────────────
const SUBJECTS = ["Matematik", "Fizik", "Kimya", "Biyoloji", "Akıl Yürütme & Veri"];
const Syllabus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Backdrop arc={0.6}>
      <AbsoluteFill style={{ padding: "230px 90px 0", alignItems: "flex-start" }}>
        <Pill bg={C.orange} size={32}>LESSON PLAN · CEnT-S</Pill>
        <div style={{ marginTop: 40 }}>
          <Kinetic text={"CEnT-S müfredatı\nbaştan sona\nincelendi."} size={118} align="left" stagger={3} highlight={["incelendi."]} />
        </div>
        <div style={{ marginTop: 60, width: "100%", display: "flex", flexDirection: "column", gap: 22 }}>
          {SUBJECTS.map((s, i) => {
            const p = spring({ frame: frame - 14 - i * 5, fps, config: { damping: 14, stiffness: 160 } });
            const ck = spring({ frame: frame - 20 - i * 5, fps, config: { damping: 8, stiffness: 200 } });
            return (
              <div
                key={s}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  background: "white",
                  border: `2px solid ${C.line}`,
                  borderLeft: `10px solid ${C.orange}`,
                  borderRadius: 24,
                  padding: "24px 32px",
                  boxShadow: "0 12px 30px rgba(15,27,45,0.08)",
                  transform: `translateX(${(1 - p) * 700}px)`,
                  opacity: p,
                }}
              >
                <div style={{ transform: `scale(${ck})` }}>
                  <Check size={60} />
                </div>
                <div style={{ fontFamily, fontWeight: 800, fontSize: 54, color: C.navy }}>{s}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Backdrop>
  );
};

// ───────────────────────── 4. 620 counter ─────────────────────────
const Mosaic: React.FC = () => {
  const frame = useCurrentFrame();
  const tiles = Array.from({ length: 32 }, (_, i) => `mosaic/m${i + 1}.jpg`);
  const cols = 4;
  return (
    <div
      style={{
        position: "absolute",
        left: -300,
        top: -400,
        width: 1800,
        transform: `rotate(-10deg) translateY(${-frame * 4}px)`,
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 22,
      }}
    >
      {[...tiles, ...tiles].map((t, i) => (
        <Img
          key={i}
          src={staticFile(t)}
          style={{ width: "100%", borderRadius: 18, boxShadow: "0 8px 24px rgba(0,0,0,.12)", border: `2px solid ${C.line}` }}
        />
      ))}
    </div>
  );
};

const Counter: React.FC = () => {
  const frame = useCurrentFrame();
  const n = Math.round(interpolate(frame, [4, 44], [0, 620], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const pop = spring({ frame: frame - 44, fps: 30, config: { damping: 7, stiffness: 220 } });
  return (
    <Backdrop arc={0}>
      <Mosaic />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 48%, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.9) 42%, rgba(255,255,255,0.55) 80%)" }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            fontFamily,
            fontWeight: 900,
            fontSize: 400,
            color: C.orange,
            letterSpacing: -20,
            lineHeight: 0.9,
            transform: `scale(${1 + pop * 0.06 - (frame > 44 ? 0.06 * Math.min((frame - 44) / 10, 1) : 0)})`,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {n}
        </div>
        <Kinetic text={"mikro\nvideo ders"} size={140} delay={8} stagger={4} />
        <div style={{ marginTop: 40 }}>
          <Pill size={40} style={{ opacity: interpolate(frame, [40, 52], [0, 1], clamp) }}>
            Kısa · Odaklı · Adım adım
          </Pill>
        </div>
      </AbsoluteFill>
    </Backdrop>
  );
};

// ───────────────────────── 5. Lesson montage ─────────────────────────
// Full lesson frames (text + formulas + visual) so the viewer sees how a lesson actually reads.
type Shot = { kind: "video" | "screen"; src: string; subject: Subject; topic: string; title?: string };
type Subject = "FİZİK" | "KİMYA" | "BİYOLOJİ" | "MATEMATİK";
const SUBJECT_COLOR: Record<Subject, string> = {
  FİZİK: C.orange,
  KİMYA: C.blue,
  BİYOLOJİ: C.green,
  MATEMATİK: "#7C3AED",
};
const SHOTS: Shot[] = [
  { kind: "screen", src: "screens/bio_mosaic.jpg", subject: "BİYOLOJİ", topic: "Hücre Zarı" },
  { kind: "video", src: "clips/full_spring_mass.mp4", subject: "FİZİK", topic: "Yay–Kütle Sistemi", title: "Simple Harmonic Motion Video Lesson" },
  { kind: "screen", src: "screens/math_algebra.jpg", subject: "MATEMATİK", topic: "Cebirsel İfadeler" },
  { kind: "video", src: "clips/full_chem_flask.mp4", subject: "KİMYA", topic: "Yarılanma Ömrü", title: "Reaction Rates Video Lesson" },
  { kind: "screen", src: "screens/phy_newton.jpg", subject: "FİZİK", topic: "Newton Yasaları" },
  { kind: "video", src: "clips/full_circ_parallel.mp4", subject: "FİZİK", topic: "Paralel Devreler", title: "Electric Circuits Video Lesson" },
  { kind: "screen", src: "screens/chem_idealgas.jpg", subject: "KİMYA", topic: "İdeal Gazlar" },
  { kind: "screen", src: "screens/bio_bilayer.jpg", subject: "BİYOLOJİ", topic: "Fosfolipit Çift Katman" },
];
const CLIP_LEN = 30;

/** Navy control bar matching the real player UI. */
const PlayerBar: React.FC<{ progress: number; time: string }> = ({ progress, time }) => (
  <div style={{ background: "#14161A", padding: "22px 30px 24px", fontFamily }}>
    <div style={{ height: 10, background: "rgba(255,255,255,.22)", borderRadius: 5, position: "relative" }}>
      <div style={{ width: `${progress * 100}%`, height: "100%", background: C.orange, borderRadius: 5 }} />
      <div
        style={{
          position: "absolute",
          left: `calc(${progress * 100}% - 15px)`,
          top: -10,
          width: 30,
          height: 30,
          borderRadius: 15,
          background: C.orange,
          border: "4px solid white",
        }}
      />
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 20, color: "white" }}>
      <div style={{ width: 0, height: 0, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderLeft: "22px solid white" }} />
      <div style={{ fontWeight: 600, fontSize: 26 }}>{time}</div>
      <div style={{ marginLeft: "auto", border: "2px solid rgba(255,255,255,.4)", padding: "4px 16px", fontSize: 24, fontWeight: 600 }}>English ⌄</div>
      <div style={{ fontSize: 24, fontWeight: 800, border: "2px solid white", borderRadius: 6, padding: "0 6px" }}>CC</div>
      <div style={{ fontSize: 24, fontWeight: 600 }}>1×</div>
    </div>
  </div>
);

/** A full lesson frame inside the app's player chrome. */
const LessonCard: React.FC<{ src: string; title: string; width: number; startFrom?: number; progress?: number; time?: string }> = ({
  src,
  title,
  width,
  startFrom = 0,
  progress = 0.4,
  time = "3:16 / 7:12",
}) => (
  <div
    style={{
      width,
      background: "white",
      borderRadius: 34,
      overflow: "hidden",
      border: `2px solid ${C.line}`,
      boxShadow: "0 30px 70px rgba(15,27,45,0.18)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 28px" }}>
      <div style={{ fontFamily, fontWeight: 800, fontSize: 32, color: C.navy, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
      <div style={{ marginLeft: "auto" }}>
        <Pill size={22}>English</Pill>
      </div>
    </div>
    <OffthreadVideo src={staticFile(src)} startFrom={startFrom} muted style={{ width: "100%", display: "block" }} />
    <PlayerBar progress={progress} time={time} />
  </div>
);

const ScreenCard: React.FC<{ src: string; width: number }> = ({ src, width }) => (
  <div
    style={{
      width,
      background: "white",
      borderRadius: 34,
      overflow: "hidden",
      border: `2px solid ${C.line}`,
      boxShadow: "0 30px 70px rgba(15,27,45,0.18)",
      padding: "14px 10px 10px",
    }}
  >
    <Img src={staticFile(src)} style={{ width: "100%", display: "block", borderRadius: 26 }} />
  </div>
);

const Montage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const i = Math.min(Math.floor(frame / CLIP_LEN), SHOTS.length - 1);
  const local = frame - i * CLIP_LEN;
  const shot = SHOTS[i];
  const punch = spring({ frame: local, fps, config: { damping: 13, stiffness: 220, mass: 0.6 } });
  const flash = interpolate(local, [0, 4], [0.6, 0], clamp);
  const zoom = 1 + local * 0.0018;
  const head = useSpring(0);
  return (
    <Backdrop arc={1}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 150 }}>
        <div style={{ opacity: head, transform: `translateY(${(1 - head) * 30}px)` }}>
          <div style={{ fontFamily, fontWeight: 900, fontSize: 70, color: C.navy, textAlign: "center", lineHeight: 1.05, letterSpacing: -1.5 }}>
            Yapay zekâ destekli derslerle
            <br />
            <span style={{ color: C.orange }}>adım adım öğren.</span>
          </div>
        </div>

        <div style={{ marginTop: 60, display: "flex", gap: 18, alignItems: "center", height: 70 }}>
          <Pill bg={SUBJECT_COLOR[shot.subject]} size={36} style={{ transform: `scale(${punch})` }}>
            {shot.subject}
          </Pill>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 48, color: C.navy, opacity: punch }}>{shot.topic}</div>
        </div>

        <div style={{ marginTop: 36, transform: `scale(${(0.93 + punch * 0.07) * zoom}) rotate(${(1 - punch) * (i % 2 ? 1.5 : -1.5)}deg)`, position: "relative" }}>
          {shot.kind === "video" ? (
            <LessonCard src={shot.src} title={shot.title ?? ""} width={1020} progress={0.2 + i * 0.08} time={`${1 + i}:0${i} / 7:12`} />
          ) : (
            <ScreenCard src={shot.src} width={1020} />
          )}
          <AbsoluteFill style={{ background: "white", opacity: flash, borderRadius: 34 }} />
        </div>

        {/* AI tutor bubble */}
        <div
          style={{
            marginTop: 44,
            display: "flex",
            alignItems: "center",
            gap: 20,
            background: "white",
            borderRadius: 999,
            padding: "16px 36px 16px 16px",
            boxShadow: "0 14px 34px rgba(15,27,45,0.14)",
            opacity: interpolate(frame, [10, 20], [0, 1], clamp),
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              background: "linear-gradient(135deg,#FFB27A,#FF7A2E)",
              color: "white",
              fontFamily,
              fontWeight: 900,
              fontSize: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            AI
          </div>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 34, color: C.navy }}>AI Tutor</div>
          <div style={{ fontFamily, fontWeight: 600, fontSize: 30, color: C.muted }}>sesli anlatım</div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {[0, 1, 2, 3, 4].map((k) => (
              <div
                key={k}
                style={{ width: 7, borderRadius: 4, background: C.orange, height: 12 + Math.abs(Math.sin(frame / 3 + k * 1.3)) * 26 }}
              />
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </Backdrop>
  );
};

// ───────────────────────── 6. Video or PDF ─────────────────────────
const PdfPage: React.FC = () => (
  <div
    style={{
      width: 640,
      background: "white",
      borderRadius: 22,
      border: `2px solid ${C.line}`,
      boxShadow: "0 30px 60px rgba(15,27,45,0.2)",
      padding: 36,
      position: "relative",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Img src={staticFile("img/logo.png")} style={{ height: 40 }} />
      <div style={{ marginLeft: "auto", background: "#E5383B", color: "white", fontFamily, fontWeight: 900, fontSize: 24, padding: "6px 14px", borderRadius: 8 }}>
        PDF
      </div>
    </div>
    <div style={{ fontFamily, fontWeight: 800, fontSize: 22, color: C.orange, marginTop: 26, letterSpacing: 2 }}>DERS NOTU · FİZİK</div>
    <div style={{ fontFamily, fontWeight: 900, fontSize: 40, color: C.navy, marginTop: 6 }}>Paralel Devreler</div>
    {[0.95, 0.85, 0.9, 0.6].map((w, i) => (
      <div key={i} style={{ height: 12, width: `${w * 100}%`, background: "#E9ECF1", borderRadius: 6, marginTop: 14 }} />
    ))}
    <div style={{ marginTop: 20, borderRadius: 12, overflow: "hidden", border: `2px solid ${C.line}` }}>
      <Img src={staticFile("img/circ_parallel_calc.jpg")} style={{ width: "100%", display: "block", objectFit: "cover", objectPosition: "right", height: 230 }} />
    </div>
    {[0.9, 0.7].map((w, i) => (
      <div key={i} style={{ height: 12, width: `${w * 100}%`, background: "#E9ECF1", borderRadius: 6, marginTop: 14 }} />
    ))}
  </div>
);

const Modes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame, fps, config: { damping: 14, stiffness: 150 } });
  const b = spring({ frame: frame - 45, fps, config: { damping: 13, stiffness: 140 } });
  return (
    <Backdrop arc={0.5}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 140 }}>
        <Kinetic text="İster video izle," size={104} highlight={["video"]} />
        <div style={{ marginTop: 40, transform: `translateY(${(1 - a) * 300}px) rotate(-2deg)`, opacity: a }}>
          <LessonCard src="clips/full_fluid_vase.mp4" title="Fluid Pressure Video Lesson" width={860} progress={0.15} time="0:08 / 9:44" />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", top: 1060 }}>
        <Sequence from={40} layout="none">
          <Kinetic text="ister PDF ile çalış." size={104} highlight={["pdf"]} />
        </Sequence>
        <div style={{ marginTop: 34, transform: `translateY(${(1 - b) * 900}px) rotate(${3 - b}deg)` }}>
          <PdfPage />
        </div>
      </AbsoluteFill>
    </Backdrop>
  );
};

// ───────────────────────── 7. Test yourself ─────────────────────────
const Test: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const SWITCH = 48;
  const ok = spring({ frame: frame - 118, fps, config: { damping: 8, stiffness: 200 } });
  const card = spring({ frame, fps, config: { damping: 14, stiffness: 150 } });
  return (
    <Backdrop arc={1}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 220 }}>
        <Kinetic text={"Sonra\nkendini test et."} size={128} stagger={4} highlight={["test"]} />
        <div style={{ marginTop: 26 }}>
          <Pill size={34} bg={C.navy}>
            Adım adım çözüm · Anında geri bildirim
          </Pill>
        </div>
        <div style={{ marginTop: 70, position: "relative", transform: `scale(${0.9 + card * 0.1})`, opacity: card }}>
          <div style={{ width: 1000, borderRadius: 30, overflow: "hidden", border: `2px solid ${C.line}`, boxShadow: "0 30px 70px rgba(15,27,45,0.2)", background: "white" }}>
            {frame < SWITCH ? (
              <OffthreadVideo src={staticFile("clips/sea_question.mp4")} muted style={{ width: "100%", display: "block" }} />
            ) : (
              <Sequence from={SWITCH} layout="none">
                <OffthreadVideo src={staticFile("clips/sea_solution.mp4")} startFrom={115 - (135 - SWITCH) - 0} muted style={{ width: "100%", display: "block" }} />
              </Sequence>
            )}
          </div>
          {/* "Your turn" timer emphasis */}
          {frame < SWITCH && (
            <div
              style={{
                position: "absolute",
                left: 690,
                top: 380,
                width: 150,
                height: 150,
                borderRadius: 75,
                border: `8px solid ${C.orange}`,
                transform: `scale(${1 + Math.sin(frame / 4) * 0.08})`,
                opacity: interpolate(frame, [6, 12], [0, 1], clamp),
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              right: -10,
              bottom: -60,
              transform: `scale(${ok}) rotate(${(1 - ok) * -20}deg)`,
              display: "flex",
              alignItems: "center",
              gap: 18,
              background: C.green,
              color: "white",
              fontFamily,
              fontWeight: 900,
              fontSize: 52,
              padding: "18px 40px 18px 22px",
              borderRadius: 999,
              boxShadow: "0 18px 40px rgba(22,163,74,.35)",
            }}
          >
            <Check size={70} color="rgba(255,255,255,.25)" />
            Doğru!
          </div>
        </div>
      </AbsoluteFill>
    </Backdrop>
  );
};

// ───────────────────────── 8. Feature strip ─────────────────────────
const Icon: React.FC<{ kind: "doc" | "pen" | "chart"; bg: string }> = ({ kind, bg }) => (
  <div style={{ width: 150, height: 150, borderRadius: 34, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      {kind === "doc" && (
        <>
          <path d="M6 2h8l5 5v15H6z" fill="white" stroke="white" />
          <path d="M9 12h7M9 15.5h7M9 19h5" stroke={bg} />
        </>
      )}
      {kind === "pen" && <path d="M4 20l1-5L16 4l4 4L9 19zM14 6l4 4" fill="none" />}
      {kind === "chart" && (
        <>
          <rect x="4" y="12" width="4" height="8" rx="1" fill="white" />
          <rect x="10" y="7" width="4" height="13" rx="1" fill="white" />
          <rect x="16" y="3" width="4" height="17" rx="1" fill="white" />
        </>
      )}
    </svg>
  </div>
);

const FEATURES = [
  { kind: "doc" as const, bg: C.blue, title: "Ders Notları", sub: "PDF & Online" },
  { kind: "pen" as const, bg: C.sky, title: "Pratik Testleri", sub: "Her dersin sonunda" },
  { kind: "chart" as const, bg: C.orange, title: "Deneme Sınavları", sub: "Gerçek sınav formatı" },
];

const Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Backdrop arc={0.4}>
      <AbsoluteFill style={{ padding: "300px 90px 0" }}>
        {FEATURES.map((f, i) => {
          const p = spring({ frame: frame - i * 8, fps, config: { damping: 10, stiffness: 200, mass: 0.7 } });
          return (
            <div
              key={f.title}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 40,
                marginBottom: 56,
                transform: `scale(${0.6 + p * 0.4})`,
                opacity: Math.min(p * 2, 1),
                transformOrigin: "left center",
              }}
            >
              <Icon kind={f.kind} bg={f.bg} />
              <div>
                <div style={{ fontFamily, fontWeight: 900, fontSize: 80, color: C.navy, letterSpacing: -2, lineHeight: 1 }}>{f.title}</div>
                <div style={{ fontFamily, fontWeight: 800, fontSize: 44, color: f.kind === "doc" ? C.blue : C.muted, marginTop: 8 }}>{f.sub}</div>
              </div>
            </div>
          );
        })}
        <div style={{ marginTop: 70 }}>
          <Kinetic text="Öğren. Pekiştir. Hazırlan." size={96} delay={26} stagger={5} highlight={["pekiştir"]} />
        </div>
      </AbsoluteFill>
    </Backdrop>
  );
};

// ───────────────────────── 9. CTA ─────────────────────────
const Laptop: React.FC<{ width: number }> = ({ width }) => {
  const h = width * 0.6;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width, height: h, background: "#14161A", borderRadius: 30, padding: 20, boxShadow: "0 40px 80px rgba(15,27,45,0.3)" }}>
        <div style={{ width: "100%", height: "100%", background: "white", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <Img src={staticFile("screens/app_full.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
        </div>
      </div>
      <div style={{ width: width * 1.14, height: 34, background: "linear-gradient(#D9DCE1,#A8ADB5)", borderRadius: "0 0 40px 40px" }} />
    </div>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const lap = useSpring(6, { damping: 14, stiffness: 110, mass: 0.9 });
  const url = useSpring(40, { damping: 9, stiffness: 200, mass: 0.6 });
  return (
    <Backdrop arc={1}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 180 }}>
        <Logo width={520} />
        <div style={{ marginTop: 70 }}>
          <Kinetic text={"Şimdi\nPreptest’te\nyayında."} size={150} stagger={4} highlight={["yayında."]} />
        </div>
        <div style={{ marginTop: 70, transform: `translateY(${(1 - lap) * 600}px)` }}>
          <Laptop width={860} />
        </div>
        <div style={{ marginTop: 90, transform: `scale(${url})` }}>
          <Pill bg={C.orange} size={64} style={{ boxShadow: "0 20px 50px rgba(255,77,18,.4)" }}>
            prep-test.com
          </Pill>
        </div>
        <div style={{ marginTop: 34, fontFamily, fontWeight: 800, fontSize: 40, color: C.navy, opacity: interpolate(frame, [50, 62], [0, 1], clamp) }}>
          620 video ders · PDF notlar · Testler
        </div>
      </AbsoluteFill>
    </Backdrop>
  );
};

// ───────────────────────── Sound ─────────────────────────
const SFX: [number, string, number][] = [
  [0, "whoosh-short", 0.5],
  [42, "whoosh", 0.55],
  [50, "pop", 0.6],
  [90, "whoosh-short", 0.5],
  [104, "click", 0.5],
  [109, "click", 0.5],
  [114, "click", 0.5],
  [119, "click", 0.5],
  [124, "click", 0.5],
  [150, "whoosh", 0.5],
  [194, "pop", 0.7],
  [240, "impact-bass-1", 0.8],
  [480, "whoosh", 0.55],
  [525, "whoosh-short", 0.55],
  [585, "whoosh", 0.55],
  [703, "chime", 0.7],
  [720, "pop", 0.6],
  [728, "pop", 0.6],
  [736, "pop", 0.6],
  [795, "impact-bass-1", 0.7],
  [835, "sparkle", 0.6],
];

export const CentsReel: React.FC = () => (
  <AbsoluteFill style={{ background: "white" }}>
    {(
      [
        [S.hook, <Hook />],
        [S.brand, <Brand />],
        [S.syllabus, <Syllabus />],
        [S.count, <Counter />],
        [S.montage, <Montage />],
        [S.modes, <Modes />],
        [S.test, <Test />],
        [S.features, <Features />],
        [S.cta, <Cta />],
      ] as [readonly [number, number], React.ReactNode][]
    ).map(([[from, to], el], i) => (
      <Sequence key={i} from={from} durationInFrames={to - from}>
        {el}
      </Sequence>
    ))}
    <Audio src={staticFile("music.wav")} volume={0.8} />
    {SFX.map(([f, name, vol], i) => (
      <Sequence key={`s${i}`} from={f} durationInFrames={90}>
        <Audio src={staticFile(`sfx/${name}.mp3`)} volume={vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
