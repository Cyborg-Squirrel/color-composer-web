
export const piPins: PiPin[] = ['D10', 'D12', 'D18', 'D21'];
export type PiPin = 'D10' | 'D12' | 'D18' | 'D21';

export type BlendMode = 'Additive' | 'Average' | 'Layer' | 'UseHighest';
export const blendModes: BlendMode[] = ['Additive', 'Average', 'Layer', 'UseHighest'];

/**
 * Frontend-derived playback state for a strip.
 *
 * The backend (per API.md) does not expose a per-strip play state; effects each
 * carry a `LightEffectStatus`. We derive the strip state as:
 *   - any effect Playing    → 'playing'
 *   - else any effect Paused → 'paused'
 *   - else                   → 'stopped'
 */
export type StripPlayState = 'playing' | 'paused' | 'stopped';

export interface ILedStrip {
    name: string;
    uuid: string;
    clientUuid: string;
    pin?: string | null;
    length: number;
    height: number;
    brightness: number;
    blendMode: BlendMode;
    inUse: boolean;
}

export type { IStripsApi } from './strips_api.interface';
export { MockStripsApi } from './strips_api.mock';
export { RealStripsApi } from './strips_api.real';

