import type { StripPlayState } from "~/api/strips/strips_api";

interface StripPreviewBarProps {
  online: boolean;
  playState: StripPlayState;
  brightness: number; // 0-100
  effectType?: string | null;
  color?: string | null;
  colorB?: string | null;
  size?: "normal" | "small";
}

function pickBackground(effectType: string | null | undefined, color: string | null | undefined, colorB: string | null | undefined): { background: string; isGradient: boolean } {
  const fallback = color || "#4488ff";
  if (!effectType) return { background: fallback, isGradient: false };
  return {
    background: `linear-gradient(90deg,${fallback}88,${fallback},${fallback}88)`,
    isGradient: true,
  };
}

function getAnimation(effectType: string | null | undefined, playState: StripPlayState, online: boolean): string {
  if (!online || playState !== "playing") return "none";
  return `strip-chase 2s linear infinite`;
}

export function StripPreviewBar({
  online,
  playState,
  brightness,
  effectType,
  color,
  colorB,
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
  const finalBg = isFlat ? "var(--neon-bg4)" : background;
  const useChaseSizing = playing;

  return (
    <div
      style={{
        width: "100%",
        height,
        borderRadius: 2,
        background: finalBg,
        backgroundSize: useChaseSizing ? "200% 100%" : "100%",
        opacity,
        animation: getAnimation(effectType, playState, online),
        transition: "opacity .3s, background .3s",
      }}
      aria-hidden
    />
  );
}

export default StripPreviewBar;
