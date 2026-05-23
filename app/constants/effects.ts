
export function previewBackground(effectId: string | undefined | null, color: string | undefined | null): string {
  const fallback = color || '#4488ff';
  const map: Record<string, string> = {
    Rainbow:      'linear-gradient(90deg,#f00,#f80,#ff0,#0f0,#08f,#80f,#f08,#f00)',
    Fire:         'linear-gradient(90deg,#111,#440000,#882200,#cc4400,#f80,#fc0)',
    PerlinNoise:  'linear-gradient(90deg,#223,#445,#667,#445,#223)',
    GradientFlow: `linear-gradient(90deg,${fallback},#8844ff)`,
  };
  if (!effectId) return fallback;
  return map[effectId] ?? `radial-gradient(circle at 30% 30%, ${fallback}cc, ${fallback}44)`;
}
