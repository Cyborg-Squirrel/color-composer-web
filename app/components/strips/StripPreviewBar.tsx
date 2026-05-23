import type { StripPlayState } from "~/api/strips/strips_api";

interface StripPreviewBarProps {
  online: boolean;
  playState: StripPlayState;
  brightness: number; // 0-100
  effectType?: string | null;
  color?: string | null;
  colorB?: string | null;
  speed?: number; // 0-100, default 50
  size?: "normal" | "small";
}

const EFFECT_GRADIENT: Record<string, string> = {
  Rainbow:        'linear-gradient(90deg,#f00,#f80,#ff0,#0f0,#08f,#80f,#f08,#f00)',
  RainbowCycle:   'linear-gradient(90deg,#f00,#f80,#ff0,#0f0,#08f,#80f,#f08,#f00)',
  Fire:           'linear-gradient(90deg,#111,#440000,#882200,#cc4400,#f80,#fc0)',
  Party:          'linear-gradient(90deg,#f0f,#0ff,#ff0,#f00,#0f0)',
  PartyFlash:     'linear-gradient(90deg,#f0f,#0ff,#ff0,#f00,#0f0)',
  PerlinNoise:    'linear-gradient(90deg,#223,#445,#667,#445,#223)',
  'Perlin Noise': 'linear-gradient(90deg,#223,#445,#667,#445,#223)',
};

const HUE_EFFECTS = new Set([
  "Rainbow", "RainbowCycle", "Fire", "Party", "PartyFlash",
  "GradientFlow", "Gradient Flow", "PerlinNoise", "Perlin Noise",
]);
const BREATHE_EFFECTS = new Set(["Breathe", "Ripple"]);
const TWINKLE_EFFECTS = new Set(["Twinkle"]);
const STATIC_EFFECTS = new Set(["Solid", "SolidColor", "Solid Color", "Segments"]);

function pickBackground(effectType: string | null | undefined, color: string | null | undefined, colorB: string | null | undefined): { background: string; isGradient: boolean } {
  const fallback = color || "#4488ff";
  if (!effectType) return { background: fallback, isGradient: false };
  const preset = EFFECT_GRADIENT[effectType];
  if (preset) return { background: preset, isGradient: true };
  if ((effectType === "GradientFlow" || effectType === "Gradient Flow") && colorB) {
    return { background: `linear-gradient(90deg,${color || "#4488ff"},${colorB})`, isGradient: true };
  }
  return {
    background: `linear-gradient(90deg,${fallback}88,${fallback},${fallback}88)`,
    isGradient: true,
  };
}

function getAnimation(effectType: string | null | undefined, playState: StripPlayState, online: boolean, speed: number): string {
  if (!online || playState !== "playing") return "none";
  const s = Math.max(speed, 1) / 50;
  if (HUE_EFFECTS.has(effectType ?? "")) return `strip-hue ${3 / s}s linear infinite`;
  if (BREATHE_EFFECTS.has(effectType ?? "")) return `strip-breathe ${2 / s}s ease-in-out infinite`;
  if (TWINKLE_EFFECTS.has(effectType ?? "")) return `strip-twinkle ${1.5 / s}s ease-in-out infinite`;
  return `strip-chase ${2 / s}s linear infinite`;
}

export function StripPreviewBar({
  online,
  playState,
  brightness,
  effectType,
  color,
  colorB,
  speed = 50,
  size = "normal",
}: StripPreviewBarProps) {
  const playing = online && playState === "playing";
  const { background, isGradient } = pickBackground(effectType, color, colorB);
  const height = size === "small" ? 6 : 10;

  let opacity = brightness / 100;
  if (!online) opacity = 0.12;
  else if (playState === "paused") opacity = 0.35;
  else if (playState === "stopped") opacity = 1;

  const isFlat = playState === "stopped" || !online;
  const isStaticEffect = STATIC_EFFECTS.has(effectType ?? "");
  const finalBg = isFlat ? "var(--neon-bg4)" : background;
  const useChaseSizing = playing && !isStaticEffect && !HUE_EFFECTS.has(effectType ?? "") && !BREATHE_EFFECTS.has(effectType ?? "") && !TWINKLE_EFFECTS.has(effectType ?? "");

  return (
    <div
      style={{
        width: "100%",
        height,
        borderRadius: 2,
        background: finalBg,
        backgroundSize: useChaseSizing ? "200% 100%" : "100%",
        opacity,
        animation: getAnimation(effectType, playState, online, speed),
        transition: "opacity .3s, background .3s",
      }}
      aria-hidden
    />
  );
}

export default StripPreviewBar;
