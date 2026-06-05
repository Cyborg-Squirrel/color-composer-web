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
      { key: 'color', type: 'RgbColor', validators: [], description: 'Output color', default: '#ffffff' },
    ],
  },
  {
    effectName: 'Segments',
    category: 'Static',
    fields: [
      { key: 'color', type: 'RgbColor', validators: [], description: 'Segment color', default: '#00aaff' },
      { key: 'count', type: 'Integer', validators: [{ type: 'min', value: 2 }, { type: 'max', value: 16 }], description: 'Number of segments', default: 4 },
    ],
  },
  {
    effectName: 'Breathe',
    category: 'Ambient',
    fields: [
      { key: 'color', type: 'RgbColor', validators: [], description: 'Glow color', default: '#ffaa00' },
      { key: 'speed', type: 'Integer', validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Pulse speed', default: 50 },
    ],
  },
  {
    effectName: 'Rainbow',
    category: 'Ambient',
    fields: [
      { key: 'speed', type: 'Integer', validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Cycle speed', default: 50 },
      { key: 'reverse', type: 'Boolean', validators: [], description: 'Reverse direction', default: false },
    ],
  },
  {
    effectName: 'Twinkle',
    category: 'Ambient',
    fields: [
      { key: 'color', type: 'RgbColor', validators: [], description: 'Twinkle color', default: '#ffffff' },
      { key: 'density', type: 'Integer', validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'How many LEDs sparkle at once (percent)', default: 30 },
      { key: 'speed', type: 'Integer', validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Flicker speed', default: 50 },
    ],
  },
  {
    effectName: 'Fire',
    category: 'Ambient',
    fields: [
      { key: 'cooling', type: 'Integer', validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'How quickly flames fade', default: 55 },
      { key: 'sparking', type: 'Integer', validators: [{ type: 'min', value: 0 }, { type: 'max', value: 255 }], description: 'New spark probability', default: 120 },
    ],
  },
  {
    effectName: 'Ripple',
    category: 'Motion',
    fields: [
      { key: 'color', type: 'RgbColor', validators: [], description: 'Ripple color', default: '#0080ff' },
      { key: 'speed', type: 'Integer', validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Ripple speed', default: 50 },
    ],
  },
  {
    effectName: 'GradientFlow',
    category: 'Ambient',
    fields: [
      { key: 'color',  type: 'RgbColor', validators: [], description: 'Start color', default: '#ff0000' },
      { key: 'colorB', type: 'RgbColor', validators: [], description: 'End color', default: '#0000ff' },
      { key: 'speed',  type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Flow speed', default: 50 },
    ],
  },
  {
    effectName: 'PerlinNoise',
    category: 'Ambient',
    fields: [
      { key: 'speed', type: 'Integer', validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Animation speed', default: 50 },
      { key: 'scale', type: 'Integer', validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Noise scale', default: 20 },
    ],
  },
  {
    effectName: 'Chase',
    category: 'Motion',
    fields: [
      { key: 'color',  type: 'RgbColor', validators: [], description: 'Chase color', default: '#ffffff' },
      { key: 'speed',  type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Chase speed', default: 50 },
      { key: 'length', type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 50 }],  description: 'Chase segment length', default: 5 },
    ],
  },
  {
    effectName: 'ColorWipe',
    category: 'Motion',
    fields: [
      { key: 'color', type: 'RgbColor', validators: [], description: 'Wipe color', default: '#00ff00' },
      { key: 'speed', type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Wipe speed', default: 50 },
    ],
  },
  {
    effectName: 'Comet',
    category: 'Motion',
    fields: [
      { key: 'color', type: 'RgbColor', validators: [], description: 'Comet head color', default: '#ffffff' },
      { key: 'speed', type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Comet speed', default: 50 },
      { key: 'tail',  type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 50 }],  description: 'Tail length', default: 10 },
    ],
  },
  {
    effectName: 'Bounce',
    category: 'Motion',
    fields: [
      { key: 'color', type: 'RgbColor', validators: [], description: 'Bounce color', default: '#ff00ff' },
      { key: 'speed', type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Bounce speed', default: 50 },
    ],
  },
  {
    effectName: 'MeteorRain',
    category: 'Motion',
    fields: [
      { key: 'color', type: 'RgbColor', validators: [], description: 'Meteor color', default: '#ffffff' },
      { key: 'speed', type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Meteor speed', default: 50 },
      { key: 'tail',  type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 50 }],  description: 'Tail length', default: 10 },
    ],
  },
  {
    effectName: 'Scanner',
    category: 'Motion',
    fields: [
      { key: 'color', type: 'RgbColor', validators: [], description: 'Scanner color', default: '#ff0000' },
      { key: 'speed', type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Scan speed', default: 50 },
    ],
  },
  {
    effectName: 'CylonEye',
    category: 'Motion',
    fields: [
      { key: 'color', type: 'RgbColor', validators: [], description: 'Eye color', default: '#ff0000' },
      { key: 'speed', type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Sweep speed', default: 50 },
      { key: 'width', type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 30 }],  description: 'Eye width', default: 5 },
    ],
  },
  {
    effectName: 'Strobe',
    category: 'Motion',
    fields: [
      { key: 'color', type: 'RgbColor', validators: [], description: 'Strobe color', default: '#ffffff' },
      { key: 'speed', type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Flash speed', default: 50 },
      { key: 'duty',  type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 99 }],  description: 'Duty cycle (percent)', default: 50 },
    ],
  },
  {
    effectName: 'Lightning',
    category: 'Motion',
    fields: [
      { key: 'color',     type: 'RgbColor', validators: [], description: 'Bolt color', default: '#ffffff' },
      { key: 'frequency', type: 'Integer',  validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Strikes per minute', default: 30 },
    ],
  },
  {
    effectName: 'PartyFlash',
    category: 'Motion',
    fields: [
      { key: 'speed', type: 'Integer', validators: [{ type: 'min', value: 1 }, { type: 'max', value: 100 }], description: 'Flash rate', default: 50 },
    ],
  },
  {
    effectName: 'BpmSync',
    category: 'Motion',
    fields: [
      { key: 'color', type: 'RgbColor', validators: [], description: 'Pulse color', default: '#ff0000' },
      { key: 'bpm',   type: 'Integer',  validators: [{ type: 'min', value: 40 }, { type: 'max', value: 240 }], description: 'Beats per minute', default: 120 },
    ],
  },
];
