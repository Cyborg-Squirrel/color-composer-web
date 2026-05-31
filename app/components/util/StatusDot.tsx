interface StatusDotProps {
  connected: boolean;
  size?: number;
}

const CONNECTED_GREEN = "var(--mantine-color-green-8)";
const DISCONNECTED_GRAY = "var(--mantine-color-gray-8)";

export function StatusDot({ connected, size = 7 }: StatusDotProps) {
  const color = connected ? CONNECTED_GREEN : DISCONNECTED_GRAY;
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        boxShadow: connected ? `0 0 5px ${color}` : "none",
        flexShrink: 0,
      }}
    />
  );
}

export default StatusDot;
