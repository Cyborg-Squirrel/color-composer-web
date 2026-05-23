import type { StripPlayState } from "~/api/strips/strips_api";

interface StatusDotProps {
  online: boolean;
  playState: StripPlayState;
  size?: number;
}

export function StatusDot({ online, playState, size = 7 }: StatusDotProps) {
  let color: string;
  let glow = false;
  if (!online) {
    color = "var(--neon-text3)";
  } else if (playState === "playing") {
    color = "var(--neon-accent)";
    glow = true;
  } else if (playState === "paused") {
    color = "var(--neon-amber)";
  } else {
    color = "var(--neon-text3)";
  }

  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        boxShadow: glow ? `0 0 5px ${color}` : "none",
        flexShrink: 0,
      }}
    />
  );
}

export default StatusDot;
