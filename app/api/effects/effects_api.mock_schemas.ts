import type { IEffectSchema } from './effects_api';

/**
 * Stand-in schemas used by the mock effects API. Shape matches
 * `GET /effect/schemas` per API.md. The real backend is the source of truth
 * (see Cyborg-Squirrel/color-composer PR #62); this dataset only powers
 * standalone (VITE_MOCK_MODE=true) operation.
 */
export const MOCK_EFFECT_SCHEMAS: IEffectSchema[] = [
  {
    effectName: 'Solid',
    category: 'Static',
    fields: [
      { key: 'color', type: 'RgbColor', validators: [], description: 'Output color' },
    ],
  },
  {
    effectName: 'Segments',
    category: 'Static',
    fields: [
      { key: 'color', type: 'RgbColor', validators: [], description: 'Segment color' },
      { key: 'count', type: 'Integer', validators: [{ type: 'min', value: 2 }, { type: 'max', value: 16 }], description: 'Number of segments' },
    ],
  },
  {
    effectName: 'Breathe',
    category: 'Ambient',
    fields: [
      { key: 'color', type: 'RgbColor', validators: [], description: 'Glow color' },
      { key: 'speed', type: 'Integer', validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Pulse speed' },
    ],
  },
  {
    effectName: 'Rainbow',
    category: 'Ambient',
    fields: [
      { key: 'speed', type: 'Integer', validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Cycle speed' },
      { key: 'reverse', type: 'Boolean', validators: [], description: 'Reverse direction' },
    ],
  },
  {
    effectName: 'Twinkle',
    category: 'Ambient',
    fields: [
      { key: 'color', type: 'RgbColor', validators: [], description: 'Twinkle color' },
      { key: 'density', type: 'Integer', validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'How many LEDs sparkle at once (percent)' },
      { key: 'speed', type: 'Integer', validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Flicker speed' },
    ],
  },
  {
    effectName: 'Fire',
    category: 'Ambient',
    fields: [
      { key: 'cooling', type: 'Integer', validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'How quickly flames fade' },
      { key: 'sparking', type: 'Integer', validators: [{ type: 'min', value: 0 }, { type: 'max', value: 255 }], description: 'New spark probability' },
    ],
  },
  {
    effectName: 'Ripple',
    category: 'Motion',
    fields: [
      { key: 'color', type: 'RgbColor', validators: [], description: 'Ripple color' },
      { key: 'speed', type: 'Integer', validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Ripple speed' },
    ],
  },
  {
    effectName: 'GradientFlow',
    category: 'Ambient',
    fields: [
      { key: 'color',  type: 'RgbColor', validators: [], description: 'Start color' },
      { key: 'colorB', type: 'RgbColor', validators: [], description: 'End color' },
      { key: 'speed',  type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Flow speed' },
    ],
  },
  {
    effectName: 'PerlinNoise',
    category: 'Ambient',
    fields: [
      { key: 'speed', type: 'Integer', validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Animation speed' },
      { key: 'scale', type: 'Integer', validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Noise scale' },
    ],
  },
  {
    effectName: 'Chase',
    category: 'Motion',
    fields: [
      { key: 'color',  type: 'RgbColor', validators: [], description: 'Chase color' },
      { key: 'speed',  type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Chase speed' },
      { key: 'length', type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 50 }],  description: 'Chase segment length' },
    ],
  },
  {
    effectName: 'ColorWipe',
    category: 'Motion',
    fields: [
      { key: 'color', type: 'RgbColor', validators: [], description: 'Wipe color' },
      { key: 'speed', type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Wipe speed' },
    ],
  },
  {
    effectName: 'Comet',
    category: 'Motion',
    fields: [
      { key: 'color', type: 'RgbColor', validators: [], description: 'Comet head color' },
      { key: 'speed', type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Comet speed' },
      { key: 'tail',  type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 50 }],  description: 'Tail length' },
    ],
  },
  {
    effectName: 'Bounce',
    category: 'Motion',
    fields: [
      { key: 'color', type: 'RgbColor', validators: [], description: 'Bounce color' },
      { key: 'speed', type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Bounce speed' },
    ],
  },
  {
    effectName: 'MeteorRain',
    category: 'Motion',
    fields: [
      { key: 'color', type: 'RgbColor', validators: [], description: 'Meteor color' },
      { key: 'speed', type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Meteor speed' },
      { key: 'tail',  type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 50 }],  description: 'Tail length' },
    ],
  },
  {
    effectName: 'Scanner',
    category: 'Motion',
    fields: [
      { key: 'color', type: 'RgbColor', validators: [], description: 'Scanner color' },
      { key: 'speed', type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Scan speed' },
    ],
  },
  {
    effectName: 'CylonEye',
    category: 'Motion',
    fields: [
      { key: 'color', type: 'RgbColor', validators: [], description: 'Eye color' },
      { key: 'speed', type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Sweep speed' },
      { key: 'width', type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 30 }],  description: 'Eye width' },
    ],
  },
  {
    effectName: 'Strobe',
    category: 'Motion',
    fields: [
      { key: 'color', type: 'RgbColor', validators: [], description: 'Strobe color' },
      { key: 'speed', type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Flash speed' },
      { key: 'duty',  type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 99 }],  description: 'Duty cycle (percent)' },
    ],
  },
  {
    effectName: 'Lightning',
    category: 'Motion',
    fields: [
      { key: 'color',     type: 'RgbColor', validators: [], description: 'Bolt color' },
      { key: 'frequency', type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Strikes per minute' },
    ],
  },
  {
    effectName: 'PartyFlash',
    category: 'Motion',
    fields: [
      { key: 'speed', type: 'Integer', validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Flash rate' },
    ],
  },
  {
    effectName: 'BpmSync',
    category: 'Motion',
    fields: [
      { key: 'color', type: 'RgbColor', validators: [], description: 'Pulse color' },
      { key: 'bpm',   type: 'Integer',  validators: [{ type: 'min', value: 40 }, { type: 'max', value: 240 }], description: 'Beats per minute' },
    ],
  },
];
